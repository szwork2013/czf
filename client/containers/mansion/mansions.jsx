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

import MansionsHeader from '../../components/mansion/mansions_header'
import MansionsBase from '../../components/mansion/mansions_base'
import MansionsHouseLayouts from '../../components/mansion/mansions_house_layouts'

class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      houseLayouts: [],
      houses: [],
      shops: [],
      ownMansions: {},
      forceUpdate: true
    }
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

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    this.state.forceUpdate = true         //删除时需要
    this.setState({forceUpdate: true})
    //物业单位默认选择第一个
    this.stateOwnMansions(nextProps.mansions)
    // this.forceUpdate()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
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
    // this.ownMansions = ownMansions
    // this.state.ownMansions = ownMansions
    this.setState({ownMansions})
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
    } else if (this.state.forceUpdate) {
      if (!mansions[this.state.mansion._id]) {
        for (let key in mansions) {
          this.selectMansion(mansions[key])
          return
        }
      } else {
        this.selectMansion(mansions[this.state.mansion._id])
        return
      }
    }
  }
  selectMansion(mansion) {    
    mansion = _.cloneDeep(mansion);
    let houseLayouts = []

    if (mansion.houseLayouts) {
      houseLayouts = mansion.houseLayouts
      mansion.houseLayouts = true;
    } 
    // let houseLayouts = mansion.houseLayouts;
    // mansion.houseLayouts = true;
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
    if (!mansion.houseLayouts) {
      formData.houseLayouts = true
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
    this.selectMansion(this.state.ownMansions[value])
  }

  render() {
    let styles = this.getStyles()
    let props = this.props
    let mansion = this.state.mansion;
    let ownMansions = this.state.ownMansions
    let houseLayouts = this.state.houseLayouts;
    let houseLayoutPatterns = props.houseLayoutPatterns;

    /*
<div style={{marginBottom: '20px'}}>
          <CommonSelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)} style={styles.marginRight}
            floatingLabelText='物业单位' items={this.ownMansions} itemValue='_id' itemPrimaryText='name' itemKey='_id' />
          <RaisedButton label="新建" labelPosition="before" style={styles.button} primary={true} onTouchEnd={this.onAddMansionDialogClick.bind(this)}>
          <RaisedButton label="导入旧数据" labelPosition="before" style={styles.button} primary={true}>
            <input type="file" style={styles.fileInput} ref="import" onChange={this.onUpload.bind(this)}/>
          </RaisedButton>
        </div>
     */
    return (
      <div>
        <MansionsHeader mansion={mansion} ownMansions={ownMansions} 
            handleMansionsChange={this.handleMansionsChange.bind(this)}
            actions={props.actions} forceUpdate={this.state.forceUpdate}/>
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
      fileInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      },
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









