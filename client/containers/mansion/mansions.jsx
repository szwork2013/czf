'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import Colors from 'material-ui/lib/styles/colors';

import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox, RadioButtonGroup, RadioButton } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';
import * as UsersActions from '../../actions/users';

import MansionsHeader from '../../components/mansion/mansions_header'
import MansionsBase from '../../components/mansion/mansions_base'
import MansionsHouseLayouts from '../../components/mansion/mansions_house_layouts'
import MansionsHouses from '../../components/mansion/mansions_houses'
import MansionsManagers from '../../components/mansion/mansions_managers'

// import ObjectId from 'objectid'


import CommonRadioButtonGroup from '../../components/common/common_radio_button_group'


class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      managersInfo: {},
      houseLayouts: [],
      floor: [],
      shops: [],
      ownMansions: {},
      forceUpdate: true,

      showTab: "base",
    },
    this.newManager = null
  }

  /*
   * 组件加载
   */
  componentWillMount() {
    if (!this.props.houseLayoutPatterns || this.props.houseLayoutPatterns.length === 0) {
      //取得公共布局
      this.props.actions.requestHouseLayoutPatternsClick();
    }
    // if (!this.props.mansions || this.props.mansions.length === 0) {
    //   //取得所有资产
    //   this.props.actions.requestMansionsClick();
    // } else {
    //   //物业单位默认选择第一个
    //   this.stateOwnMansions(this.props.mansions, this.props.users)
    // }
    this.props.actions.requestMansionsClick();
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
    this.stateOwnMansions(nextProps.mansions, nextProps.users)
    // this.forceUpdate()
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
  }

  stateOwnMansions(mansions, users) {
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
    this.selectDefaultMansion(ownMansions, users)
  }
  /* 
   * 当state中的Mansion为空时，设置为第一个
   */
  selectDefaultMansion(mansions, users) {
    if (_.isEmpty(this.state.mansion) && mansions.length>0) {
      for (let key in mansions) {
        this.selectMansion(mansions[key], users)
        return
      }
    } else if (this.state.forceUpdate) {
      if (mansions<=0) {
        this.setState({mansion: {}, houseLayouts: [], floor: [], shops: [], managersInfo: {}})
      } else if (!mansions[this.state.mansion._id]) {
        for (let key in mansions) {
          this.selectMansion(mansions[key], users)
          return
        }
      } else {
        this.selectMansion(mansions[this.state.mansion._id], users)
        return
      }
    }
  }

  /*
   * 将扁平化的houses格式化成floor
   */
  buildFloor(mansion, houses) {
    var floor = []

    houses.forEach((house, idx) => {
      if (!floor[house.floor]) floor[house.floor] = [];
      house.__idx = idx;
      floor[house.floor][house.room] = house;
    })
    for (var i=0; i<mansion.floorCount; i++) {
      if (!floor[i]) floor[i] = []
    }
    return floor
  }
  selectMansion(mansion, users) {    
    mansion = _.cloneDeep(mansion);
    var users = users || this.props.users || {};
    var userId = null;

    var managersInfo = this.state.managersInfo; //需要保留旧的managers信息
    if (mansion.managersInfo) {
      managersInfo = _.assign(managersInfo, mansion.managersInfo)
      mansion.managersInfo = true;
    }
    //处理新添加的管理员，其key为new
    var managerInfoNew = this.newManager
    if (managerInfoNew) {
      var newUserId = null
      if (managerInfoNew.mobile) {
        if (!_.findKey(managersInfo, {user: {mobile: managerInfoNew.mobile}})) {
          newUserId = _.findKey(users, {mobile: managerInfoNew.mobile})
        }
      } else if (managerInfoNew.email) {
        if (!_.findKey(managersInfo, {user: {email: managerInfoNew.email}})) {
          newUserId = _.findKey(users, {email: managerInfoNew.email})
        }
      }
      if (newUserId) { 
        managersInfo[newUserId] = {user: users[newUserId]}
        // this.props.actions.openToast({msg: '添加成功'})
      }
      this.newManager = null
    }

    var houseLayouts = []
    if (mansion.houseLayouts) {
      houseLayouts = mansion.houseLayouts
      mansion.houseLayouts = true;
    } 
    // let houseLayouts = mansion.houseLayouts;
    // mansion.houseLayouts = true;
    var floor = []
    if (mansion.houses) {
      floor = this.buildFloor(mansion, mansion.houses)
      mansion.houses = true;
    } 
    var shops = []
    if (mansion.shops) {
      shops = mansion.shops
      mansion.shops = true
    }
    this.setState({mansion, houseLayouts, floor, shops, managersInfo})
    this.getMansionAllInfo(mansion)
  }
  /*
   * 取得物业的出租房、商铺信息
   */
  getMansionAllInfo(mansion) {
    let formData = {}
    if (!mansion.managersInfo) {
      formData.managersInfo = true
    }
    if (!mansion.houses) {
      formData.houses = true
      formData.tenant = true
      formData.subscriber = true
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


  /*
   * 选择物业单位
   */
  handleMansionsChange(value) {
    this.state.managersInfo = {}
    this.selectMansion(this.state.ownMansions[value], this.props.users)
  }

  /*
   * houseLayouts增删改
   */
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

  /*
   * houses增删改
   */
  onAddFloor() {
    var floor = this.state.floor
    var mansion = this.state.mansion
    floor.push([])
    mansion.floorCount += 1
    this.setState({floor, mansion})
  }
  onDeleteFloor(idx) {
    var floor = this.state.floor
    var mansion = this.state.mansion
    var houses = floor[idx]
    if (houses.length>0) {
      for (var i=0; i<houses.length; i++) {
        if (houses[i].tenantId || houses[i].subscriberId) {
          this.props.actions.openToast({msg: '该楼层尚有房间出租或被预定，无法删除！'})
          return;
        }
      }
    }
    if (floor.length-1 === idx) {
      //顶层可以删除
      floor.splice(idx, 1);
      mansion.floorCount -= 1
    } else {
      //否则只清除该楼层的合部房屋数据
      floor[idx] = []
    }
    mansion.housesCount[idx] = 0
    mansion.housesExistCount[idx] = 0
    this.setState({floor, mansion}) 
  }
  onAddHouse(floorIdx) {
    var floor = this.state.floor
    var mansion = this.state.mansion
    mansion.housesCount[floorIdx] += 1;
    mansion.housesExistCount[floorIdx] += 1;
    floor[floorIdx].push({mansionId: mansion._id, floor: floorIdx, room: floor[floorIdx].length, electricMeterEndNumber: 0, waterMeterEndNumber: 0, isExist: true})
    this.setState({floor, mansion})
  }
  onDeleteHouse(floorIdx, roomIdx) {
    var floor = this.state.floor
    var houses = floor[floorIdx]
    var mansion = this.state.mansion
    //只能删除最后一个
    if (houses.length-1 === roomIdx) {
      var house = houses[roomIdx]
      if (house.tenantId || house.subscriberId) {
        this.props.actions.openToast({msg: '该房间已出租或被预定，无法删除！'})
        return;
      }
      houses.splice(roomIdx, 1)
      mansion.housesCount[floorIdx] -= 1;
      mansion.housesExistCount[floorIdx] -= 1;
      this.setState({floor, mansion}) 
    } else {
      this.props.actions.openToast({msg: '只能删除最后一间房间！'})
      return;
    }
  }
  onChangeHouseExist(floorIdx, roomIdx) {
    var floor = this.state.floor
    var house = floor[floorIdx][roomIdx]
    var mansion = this.state.mansion
    if (house.isExist) {
      if (house.tenantId || house.subscriberId) {
        this.props.actions.openToast({msg: '该房间已出租或被预定，无法设为不存在！'})
        return;
      }
      house.isExist = false;
      mansion.housesExistCount[floorIdx] -= 1;
    } else {
      house.isExist = true;
      mansion.housesExistCount[floorIdx] += 1;
    }
    this.setState({floor, mansion}) 
  }

  /*
   * 管理员
   */
  onAddManager(value) {
    var userId = null
    var user = {}
    var users = this.props.users || {}
    var managersInfo = this.state.managersInfo || {}
    var findManagersInfoCond = {}
    var findUserCond = {}
    if (utils.isMobileNumber(value)) {
      findManagersInfoCond = {user: {mobile: value}}
      findUserCond = {mobile: value}
    } else if (utils.isEmail(value)) {
      findManagersInfoCond = {user: {email: value}}
      findUserCond = {email: value}
    } else {
      this.props.actions.openToast({msg: '请输入正确的手机号或邮箱'})
      return;
    }
    userId = _.findKey(managersInfo, findManagersInfoCond)
    if (userId) {
      this.props.actions.openToast({msg: '用户已存在您的管理员列表中'})
      return
    }
    userId = _.findKey(users, findUserCond)
    if (userId) { 
      managersInfo[userId] = {user: users[userId]}
      this.setState({managersInfo})
      // this.props.actions.openToast({msg: '添加成功'})
      return
    }
    this.newManager = findUserCond;
    this.props.actions.getUserClick(findUserCond);
  }
  onDeleteManager(managerId) {
    delete this.state.managersInfo[managerId]
    this.setState({managersInfo: this.state.managersInfo})
  }

  saveMansionBase() {
    // log.error(this.state.mansion)
    this.props.actions.saveMansionBaseClick({mansion: this.state.mansion})
  }

  saveHouseLayouts() {
    // log.error(this.state.houseLayouts)
    this.props.actions.saveHouseLayoutsClick({mansionId: this.state.mansion._id, houseLayouts: this.state.houseLayouts})
  }

  onSaveFloor() {
    this.props.actions.saveFloorClick({mansionId: this.state.mansion._id, floor: this.state.floor})
  }

  saveManagersInfo() {
    this.props.actions.saveManagersInfoClick({mansionId: this.state.mansion._id, managersInfo: this.state.managersInfo})
  }

  /*
   * 切换物业的属性
   */
  onShowTabChange(value) {
    this.setState({showTab: value})
  }
  getTab(styles) {
    var props = this.props
    var mansion = this.state.mansion;
    var managersInfo = this.state.managersInfo;
    var houseLayouts = this.state.houseLayouts;
    var houseLayoutPatterns = props.houseLayoutPatterns;
    var floor = this.state.floor
    var theme = props.theme

    switch (this.state.showTab) {
      case 'managers':
        return (
          <MansionsManagers managersInfo={managersInfo}
            onAddManager={this.onAddManager.bind(this)} onDeleteManager={this.onDeleteManager.bind(this)}
            saveManagersInfo={this.saveManagersInfo.bind(this)} updateParentState={this.updateState.bind(this)}/>
        )
      case 'houseLayouts':
        return (
          <MansionsHouseLayouts houseLayouts={houseLayouts} theme={theme} floor={floor}
            onDeleteHouseLayout={this.onDeleteHouseLayout.bind(this)} onAddHouseLayout={this.onAddHouseLayout.bind(this)}
            houseLayoutPatterns={houseLayoutPatterns} updateParentState={this.updateState.bind(this)} 
            saveHouseLayouts={this.saveHouseLayouts.bind(this)} />
        )
      case 'houses': 
        return (
          <MansionsHouses floor={floor} houseLayouts={houseLayouts} theme={theme} 
            onAddFloor={this.onAddFloor.bind(this)} onDeleteFloor={this.onDeleteFloor.bind(this)}
            onAddHouse={this.onAddHouse.bind(this)} onDeleteHouse={this.onDeleteHouse.bind(this)}
            onChangeHouseExist={this.onChangeHouseExist.bind(this)} onSaveFloor={this.onSaveFloor.bind(this)}
            updateParentState={this.updateState.bind(this)} />
        )
      case 'base':
      default:
        return (
          <MansionsBase mansion={mansion} theme={theme}
            updateParentState={this.updateState.bind(this)} saveMansionBase={this.saveMansionBase.bind(this)} />
        )

    }
  }


  render() {
    let styles = this.getStyles()
    let props = this.props
    let mansion = this.state.mansion;
    let ownMansions = this.state.ownMansions
    let theme = props.theme
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
          <RadioButton value="managers" label="管理员" style={styles.raidoButton}/>
        </CommonRadioButtonGroup>
        {this.getTab(styles)}
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
    users: state.users,
    houseLayoutPatterns: state.houseLayoutPatterns,
    mansions: state.mansions
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, HouseLayoutPatternsAction, MansionsAction, UsersActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mansions);









