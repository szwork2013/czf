'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

import Colors from 'material-ui/lib/styles/colors';

import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';

import MansionsBase from '../../components/mansion/mansions_base'
import MansionsHouseLayouts from '../../components/mansion/mansions_house_layouts'

import CommonSelectField from '../../components/common/common_select_field'

class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      houseLayouts: [],
      houses: [],
      shops: []
    }
    this.ownMansions = {}
  }

  /*
   * 组件加载
   */
  componentWillMount() {
    if (!this.props.houseLayoutPatterns || this.props.houseLayoutPatterns.length === 0) {
      //取得公共布局
      this.props.actions.requestHouseLayoutPatternsClick();
    }
    if (!this.props.mansions || this.props.mansions.length === 0) {
      //取得所有资产
      this.props.actions.requestMansionsClick();
    } else {
      //物业单位默认选择第一个
      this.stateOwnMansions(this.props.mansions)
    }
  }

  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    //物业单位默认选择第一个
    this.stateOwnMansions(nextProps.mansions)
  }

  stateOwnMansions(mansions) {
    var ownMansions = {}
    var userId = this.props.user._id
    var mansion = null
    for (let key in mansions) {
      mansion = mansions[key]
      if (mansion.ownerId === userId)
        ownMansions[key] = mansion
    }
    this.ownMansions = ownMansions
    this.selectDefaultMansion(ownMansions)
  }
  /* 
   * 当state中的Mansion为空时，设置为第一个
   */
  selectDefaultMansion(mansions) {
    if (_.isEmpty(this.state.mansion) && !_.isEmpty(mansions)) {
      for (let key in mansions) {
        this.selectMansion(mansions[key])
        return
      }
    }
  }
  selectMansion(mansion) {    
    mansion = _.cloneDeep(mansion);
    let houseLayouts = mansion.houseLayouts;
    mansion.houseLayouts = true;
    let houses = []
    if (mansion.houses) {
      houses = mansion.houses
      mansion.houses = true;
    } 
    let shops = []
    if (mansion.shops) {
      shops = mansion.shops
      mansion.houses = true
    }
    window.selectMansion = {mansion, houseLayouts, houses, shops}
    this.setState({mansion, houseLayouts, houses, shops})
    this.getMansionAllInfo(mansion)
  }
  /*
   * 取得物业的出租房、商铺信息
   */
  getMansionAllInfo(mansion) {
    let formData = {}
    if (!mansion.houses) {
      formData.houses = true
    } 
    if (!mansion.shops) {
      formData.shops = true
    }
    if (!_.isEmpty(formData)) {
      formData.mansionId = mansion._id
      this.props.actions.requestMansionInfoClick(formData);
    }
  }

  updateState(obj) {
    this.setState(obj)
  }


  handleMansionsChange(value) {
    this.selectMansion(this.ownMansions[value])
  }
  /*
   * 取得所有物业
   */
  getMansionsMenuItem() {
    var mansions = this.ownMansions
    var retMansions = []
    var mansion = {}
    for (let idx in mansions) {
      mansion = mansions[idx]
      retMansions.push(<MenuItem value={mansion._id} primaryText={mansion.name} key={mansion._id}/>)
    }
    return retMansions;
  }


  render() {
    let styles = this.getStyles()
    let mansion = this.state.mansion;
    let houseLayouts = this.state.houseLayouts;
    let houseLayoutPatterns = this.props.houseLayoutPatterns;
    /*
      <SelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)} 
          floatingLabelText='物业单位' selectFieldRoot={{}}>
          { this.getMansionsMenuItem() }
        </SelectField>
    */    

    return (
      <div>
        <CommonSelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)}
          floatingLabelText='物业单位' items={this.ownMansions} itemValue='_id' itemPrimaryText='name' itemKey='_id' />
        <span></span>
        <br/>
        <Tabs initialSelectedIndex={0} >
          <Tab label="基础信息" ><MansionsBase mansion={mansion} updateParentState={this.updateState.bind(this)} /></Tab>
          <Tab label="户型（出租房）"><MansionsHouseLayouts houseLayouts={houseLayouts} houseLayoutPatterns={houseLayoutPatterns} updateParentState={this.updateState.bind(this)} /></Tab>
        </Tabs>
      </div>
    )
  }

  getStyles() {
    // const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      tab: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '30px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
      marginRight: {
        marginRight: '20px',
      },
      divider: {
        width: '20px',
        display: 'inline-block',
      },
      tableCellTextField: {
        minWidth: '80px',
        width: '100%',
        fontSize: '12px',
      },
      tableCellSelect: {
        minWidth: '80px',
        width: '30%',
        fontSize: '12px',
        marginRight: '10px',
      }
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    location: state.location,
    user: state.user.user,
    houseLayoutPatterns: state.houseLayoutPatterns,
    mansions: state.mansions
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, HouseLayoutPatternsAction, MansionsAction), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mansions);