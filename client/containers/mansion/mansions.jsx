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
         Checkbox, RadioButtonGroup, RadioButton } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';

import MansionsHeader from '../../components/mansion/mansions_header'
import MansionsBase from '../../components/mansion/mansions_base'
import MansionsHouseLayouts from '../../components/mansion/mansions_house_layouts'
import MansionsHouses from '../../components/mansion/mansions_houses'


import CommonRadioButtonGroup from '../../components/common/common_radio_button_group'


class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      houseLayouts: [],
      floor: [],
      shops: [],
      ownMansions: {},
      forceUpdate: true,

      showTab: "houses",
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

  buildHouses(houses) {
    var floor = []
    houses.forEach((house, idx) => {
      if (!floor[house.floor]) floor[house.floor] = [];
      house.__idx = idx;
      floor[house.floor].push(house)
    })
    for (var i=0; i<floor.length; i++) {
      if (!floor[i]) floor[i] = []
    }
    return floor
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
    var floor = []
    if (mansion.houses) {
      floor = this.buildHouses(mansion.houses)
      mansion.houses = true;
    } 
    let shops = []
    if (mansion.shops) {
      shops = mansion.shops
      mansion.shops = true
    }
    this.setState({mansion, houseLayouts, floor, shops})
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

  onDeleteHouseLayout(idx) {
    var id = this.state.houseLayouts[idx]._id;
    if (id) {
      var isInUsed = false;
      var floor = this.state.floor;
      var i, j;
      for(i=0; i<floor.length; i++) {
        var houses = floor[i]
        for(j=0; j<houses.length; j++) {
          if (id === houses[j].houseLayout) {
            isInUsed = true;
            break;
          }
        }
        if (isInUsed === true) break;
      }
      if (isInUsed) {
        this.props.actions.openToast({msg: '户型使用中，无法删除！'})
        return;
      }
    }
    this.state.houseLayouts.splice(idx, 1);
    this.setState({houseLayouts: this.state.houseLayouts})
  }
  onAddHouseLayout() {
    this.state.houseLayouts.push({});
    this.setState({houseLayouts: this.state.houseLayouts})
  }

  onAddFloor() {
    this.state.floor.push([])
    this.setState({floor: this.state.floor})
  }

  onDeleteFloor(idx) {
    var houses = this.state.floor[idx]
    if (houses.length>0) {
      for (var i=0; i<houses.length; i++) {
        if (houses[i].tenantId) {
          this.props.actions.openToast({msg: '该楼层尚有房间出租，无法删除！'})
          return;
        }
      }
    }
    this.state.floor.splice(idx, 1);
    this.setState({floor: this.state.floor})
  }

  onShowTabChange(e, value) {
    this.setState({showTab: value})
  }
  getTab(styles) {
    let props = this.props
    let mansion = this.state.mansion;
    let houseLayouts = this.state.houseLayouts;
    let houseLayoutPatterns = props.houseLayoutPatterns;
    let floor = this.state.floor
    let theme = props.theme

    switch (this.state.showTab) {
      case 'houseLayouts':
        return (
          <MansionsHouseLayouts houseLayouts={houseLayouts} theme={theme} floor={floor}
            onDeleteHouseLayout={this.onDeleteHouseLayout.bind(this)} onAddHouseLayout={this.onAddHouseLayout.bind(this)}
            houseLayoutPatterns={houseLayoutPatterns} updateParentState={this.updateState.bind(this)} />
        )
      case 'houses': 
        return (
          <MansionsHouses floor={floor} houseLayouts={houseLayouts} theme={theme} 
            onAddFloor={this.onAddFloor.bind(this)} onDeleteFloor={this.onDeleteFloor.bind(this)}
            updateParentState={this.updateState.bind(this)} />
        )
      case 'base':
      default:
        return (
          <MansionsBase mansion={mansion} updateParentState={this.updateState.bind(this)} theme={theme}/>
        )

    }
  }

  render() {
    let styles = this.getStyles()
    let props = this.props
    let mansion = this.state.mansion;
    let ownMansions = this.state.ownMansions
    let theme = props.theme
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
            actions={props.actions} forceUpdate={this.state.forceUpdate} theme={theme}/>
        <CommonRadioButtonGroup name='showTab' valueSelected={this.state.showTab} style={{marginBottom: '20px'}}
          onChange={this.onShowTabChange.bind(this)}>
          <RadioButton value="base" label="基础信息" style={styles.raidoButton}/>
          <RadioButton value="houseLayouts" label="户型管理（出租房）" style={styles.raidoButton}/>
          <RadioButton value="houses" label="出租房" style={styles.raidoButton}/>
        </CommonRadioButtonGroup>
        {this.getTab(styles)}
      </div>
    )
  }

// <Tabs initialSelectedIndex={1} >
//           <Tab label="基础信息" ><MansionsBase mansion={mansion} updateParentState={this.updateState.bind(this)} theme={theme}/></Tab>
//           <Tab label="户型（出租房）"><MansionsHouseLayouts houseLayouts={houseLayouts} theme={theme} 
//             onDeleteHouseLayout={this.onDeleteHouseLayout.bind(this)} onAddHouseLayout={this.onAddHouseLayout.bind(this)}
//             houseLayoutPatterns={houseLayoutPatterns} updateParentState={this.updateState.bind(this)} /></Tab>
//         </Tabs>
  getStyles() {
    // const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      raidioButtonGroup: {
        
        padding: '30px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
      marginRight: {
        marginRight: '20px',
      },
      raidoButton: {
        display: 'inline-block',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        marginRight: '70px',
        width: 'auto'
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









