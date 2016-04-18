'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import moment from 'moment'

import Colors from 'material-ui/lib/styles/colors';

import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox, RadioButtonGroup, RadioButton } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';
import * as UsersActions from '../../actions/users';


import CommonRadioButtonGroup from '../../components/common/common_radio_button_group'
import CommonSelectField from '../../components/common/common_select_field'
import CommonRaisedButton from '../../components/common/common_raised_button'


import HousesCheckIn from '../../components/mansion/houses_check_in'
import HousesPayRent from '../../components/mansion/houses_pay_rent'
import HousesSubscribe from '../../components/mansion/houses_subscribe'
import HousesRepay from '../../components/mansion/houses_repay'

// import CommonConfirmDialog from '../../components/common/common_confirm_dialog'


class Houses extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      houses: [],
      floorIdx: -1,
      houseIdx: -1,

      houseLayouts: [],
      houseLayoutsObj: {},
      houseLayout: 'all',

      showHouse: 'tenantable',

      floor: [],
      forceUpdate: true,

      // checkInHouse: {},
      checkInHouseFloor: -1,
      checkInHouseRoom: -1,
      checkInOpen: false,

      payRentHouseFloor: -1,
      payRentHouseRoom: -1,
      payRentOpen: false,

      subscribeHouseFloor: -1,
      subscribeHouseRoom: -1,
      subscribeOpen: false,

      repayHouseFloor: -1,
      repayHouseRoom: -1,
      repayOpen: false,
    }
  }

  /*
   * 组件加载
   */
  componentWillMount() {
    if (!this.props.mansions || this.props.mansions.length === 0) {
      //取得所有资产
      this.props.actions.requestMansionsClick();
    } else {
      //物业单位默认选择第一个
      this.selectDefaultMansion(this.props.mansions, this.props.users)
    }
  }

  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    this.state.forceUpdate = true         //删除时需要
    this.setState({forceUpdate: true})
    //物业单位默认选择第一个
    this.selectDefaultMansion(nextProps.mansions, nextProps.users)
    // this.forceUpdate()
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
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
      if (mansions.length <= 0) {
        this.setState({mansion: {}, houseLayouts: [], houseLayoutsObj: {}, floor: []})
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
  selectMansion(mansion, users) {    
    mansion = _.cloneDeep(mansion);
    var users = users || this.props.users || {};
    var userId = null;

    var houseLayouts = []
    var houseLayoutsObj = {}
    if (mansion.houseLayouts) {
      houseLayouts = mansion.houseLayouts
      for (var idx in houseLayouts) {
        houseLayoutsObj[houseLayouts[idx]._id] = houseLayouts[idx]
      }
      mansion.houseLayouts = true;
    } 
    var floor = []
    if (mansion.houses) {
      floor = this.buildFloor(mansion, mansion.houses)
      mansion.houses = true;
      // if (this.state.checkInHouse) {
      //   this.setState({checkInHouse: floor[this.state.checkInHouse.floor][this.state.checkInHouse.room]})
      // }
    } 
    this.setState({mansion, houseLayouts, houseLayoutsObj, floor})
    this.getMansionAllInfo(mansion)
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


  /*
   * 取得物业的出租房
   */
  getMansionAllInfo(mansion) {
    let formData = {}
    if (!mansion.houses) {
      formData.houses = true
      formData.tenant = true
      formData.subscriber = true
    }
    if (!mansion.houseLayouts) {
      formData.houseLayouts = true
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
    this.state.forceUpdate = true
    this.setState({forceUpdate: true, floorIdx: -1, houseIdx: -1, houseLayout: 'all'})
    this.selectMansion(this.props.mansions[value], this.props.users)

  }
  handleFloorChange(value) {
    this.state.forceUpdate = true
    this.setState({forceUpdate: true, floorIdx: value, houseIdx: -1})
  }
  handleHouseChange(value) {
    // this.state.forceUpdate = true
    this.setState({houseIdx: value})
  }
  handleHouseLayoutChange(value) {
    // this.state.forceUpdate = true
    this.setState({houseLayout: value})
  }
  onShowHouseChange(value) {
    this.setState({showHouse: value})
  }


  /*
   * 操作
   */
  checkInClick(floorIdx, houseIdx) {
    return function() {
      this.setState({checkInHouseFloor: floorIdx, checkInHouseRoom: houseIdx, checkInOpen: true})
    }
  }
  checkInOk(house) {
    this.props.actions.houseCheckInClick({house})
  }
  checkInCancel() {
    this.setState({checkInHouseFloor: -1, checkInHouseRoom: -1, checkInOpen: false})
  }

  payRentClick(floorIdx, houseIdx) {
    return function() {
      this.setState({payRentHouseFloor: floorIdx, payRentHouseRoom: houseIdx, payRentOpen: true})
    }
  }
  payRentOk(house) {
    this.props.actions.housePayRentClick({house})
  }
  payRentCancel() {
    this.setState({payRentHouseFloor: -1, payRentHouseRoom: -1, payRentOpen: false})
  }

  subscribeClick(floorIdx, houseIdx) {
    return function() {
      this.setState({subscribeHouseFloor: floorIdx, subscribeHouseRoom: houseIdx, subscribeOpen: true})
    }
  }
  subscribeOk(house) {
    this.props.actions.houseSubscribeClick({house})
  }
  subscribeCancel() {
    this.setState({subscribeHouseFloor: -1, subscribeHouseRoom: -1, subscribeOpen: false})
  }

  repayClick(floorIdx, houseIdx) {
    return function() {
      this.setState({repayHouseFloor: floorIdx, repayHouseRoom: houseIdx, repayOpen: true})
    }
  }
  repayOk(house) {
    this.props.actions.houseRepayClick({house})
  }
  repayCancel() {
    this.setState({repayHouseFloor: -1, repayHouseRoom: -1, repayOpen: false})
  }

  print(floorIdx, houseIdx) {
    return function(e) {

    }
  }

  getHouses() {
    var state = this.state
    var floor = state.floor
    var floorIdx = state.floorIdx
    var houseIdx = state.houseIdx
    var houseLayout = state.houseLayout
    var showHouse = state.showHouse

    // log.info(floorIdx, houseIdx, houseLayout, showHouse)
    var houses = []
    if (floorIdx!== -1) {
      if (houseIdx !== -1) {
        houses = []
        houses.push(floor[floorIdx][houseIdx])
      } else {
        houses = floor[floorIdx]
      }
    } else {
      floor.forEach( h => { houses = houses.concat(h) } )
    }
    // log.error(houses)
    houses = houses.filter( house => {
      return house.isExist
    })
    if (houseLayout !== 'all') {
      houses = houses.filter( house => {
        return house.houseLayout === houseLayout
      })
    }
    if (showHouse !== 'all') {
      switch (showHouse) {
        case 'tenantable':
          houses = houses.filter( house => {
            return !house.tenantId
          })
          break;
        case 'tenanted':
          houses = houses.filter( house => {
            return house.tenantId
          })
          break;
        case 'subscribed':
          houses = houses.filter( house => {
            return house.subscriberId
          })
          break;
      }
    } 
    return houses;
  }

  render() {
    var styles = this.getStyles()
    var props = this.props
    var state = this.state

    var forceUpdate = state.forceUpdate
    var mansion = state.mansion;
    var floor = state.floor;
    var floorSelect = floor.map( (houses, idx) => {
      return {idx: idx, floor: (idx+1)+''} 
    }) 
    floorSelect.unshift({idx: -1, floor: '全部'})
    var floorIdx = state.floorIdx
    // log.info(floorSelect.length, state.forceUpdate)

    var housesSelect = []
    if (floorIdx !== -1) {
      housesSelect = floor[floorIdx].map( (house, idx) => {
        return {idx: idx, house: (idx+1)+''}
      })
    }
    housesSelect.unshift({idx: -1, house: '全部'})

    var houseLayouts = state.houseLayouts.map( houseLayout => {
      return {_id: houseLayout._id, description: houseLayout.description}
    })
    houseLayouts.unshift({_id: 'all', description: '全部'})

    var houses = this.getHouses()
    var houseLayoutsObj = state.houseLayoutsObj

    var checkInHouse = {}
    if (state.checkInOpen) {
      checkInHouse = state.floor[state.checkInHouseFloor][state.checkInHouseRoom]
    }
    var payRentHouse = {}
    if (state.payRentOpen) {
      payRentHouse = state.floor[state.payRentHouseFloor][state.payRentHouseRoom]
    }

    var subscribeHouse = {}
    if (state.subscribeOpen) {
      subscribeHouse = state.floor[state.subscribeHouseFloor][state.subscribeHouseRoom]
    }

    var repayHouse = {}
    if (state.repayOpen) {
      repayHouse = state.floor[state.repayHouseFloor][state.repayHouseRoom]
    }

    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <CommonSelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)} style={styles.marginRight}
              floatingLabelText='物业单位' forceUpdate={forceUpdate}
              items={props.mansions} itemValue='_id' itemPrimaryText='name' itemKey='_id' excludeKey={['length']} fullWidth={false}/>
          <CommonSelectField value={floorIdx} onChange={this.handleFloorChange.bind(this)} style={styles.marginRight}
              floatingLabelText='楼层' forceUpdate={forceUpdate}
              items={floorSelect} itemValue='idx' itemPrimaryText='floor' />
          <CommonSelectField value={state.houseIdx} onChange={this.handleHouseChange.bind(this)} style={styles.marginRight}
              floatingLabelText='房间' forceUpdate={forceUpdate}
              items={housesSelect} itemValue='idx' itemPrimaryText='house'/>
          <br/>
          <CommonSelectField value={state.houseLayout} onChange={this.handleHouseLayoutChange.bind(this)} style={styles.marginRight}
              floatingLabelText='户型' forceUpdate={forceUpdate}
              items={houseLayouts} itemValue='_id' itemPrimaryText='description'/>
          <CommonRadioButtonGroup name='showHouse' valueSelected={this.state.showHouse} style={{display: 'inline-block', marginLeft: '20px'}}
            onChange={this.onShowHouseChange.bind(this)}>
            <RadioButton value='all' label='全部' style={styles.raidoButton}/>
            <RadioButton value='tenantable' label='可出租' style={styles.raidoButton}/>
            <RadioButton value='tenanted' label='已出租' style={styles.raidoButton}/>
            <RadioButton value='subscribed' label='已预定' style={styles.raidoButton}/>
          </CommonRadioButtonGroup>
        </div>
        <div style={styles.tab}>
          <table className='table'>
            <thead className='thead'>
              <tr className='tr'>
                <th style={{width: '4.5%'}} className='th'>楼层</th>
                <th style={{width: '4.5%'}} className='th'>房间</th>
                <th style={{width: '10%'}} className='th'>户型</th>
                <th style={{width: '4.5%'}} className='th'>状态</th>
                <th style={{width: '7%'}} className='th'>姓名</th>
                <th style={{width: '10%'}} className='th'>手机</th>
                <th style={{width: '5%'}} className='th'>电表</th>
                <th style={{width: '5%'}} className='th'>水表</th>
                <th style={{width: '8%'}} className='th'>下次交租</th>
                <th style={{width: '8%'}} className='th'>合同终止</th>
                <th className='th'>备注</th>
                <th style={{width: '22%'}} className='th'>操作</th>
              </tr>
            </thead>
            <tbody className='tbody'>
            {houses.map((house, idx) => {
              var keyString = (''+house.floor)+house.room
              var state = '空'
              var name = ''
              var mobile = ''
              var rentalEndDate = ''
              var contractEndDate = ''
              var remark = ''
              var actions = []
              // {manager.createdAt? new Date(manager.createdAt).toLocaleDateString(): ''}
              if (house.tenantId) {
                if (house.tenantId.oweRental) {
                  state = '欠'
                  remark = house.tenantId.remark + '（欠租' + house.tenantId.oweRental+'元）'
                  actions.push(
                    <button key={house._id+'payrent'} style={styles.button} 
                      onTouchTap={this.repayClick(house.floor, house.room).bind(this)}>补租</button>
                  )
                } else {
                  state = '租'
                  remark = house.tenantId.remark
                  actions.push(
                    <button key={house._id+'rent'} style={styles.button} 
                      onTouchTap={this.payRentClick(house.floor, house.room).bind(this)}>交租</button>
                  )
                }
                name = house.tenantId.name
                mobile = house.tenantId.mobile
                rentalEndDate = new moment(house.tenantId.rentalEndDate).format('YYYY.MM.DD')
                contractEndDate = new moment(house.tenantId.contractEndDate).format('YYYY.MM.DD')
                
                // actions.push(
                //   <CommonRaisedButton label="交租" primary={true} key={house._id+'rent1'}
                //     style={styles.actionButton} backgroundColor={styles.actionButtonRent.backgroundColor}
                //     onTouchTap={this.payRentClick(house.floor, house.room).bind(this)}/>
                // )
                // actions.push(
                //   <CommonRaisedButton label="退房" primary={true}  key={house._id+'out'}
                //     style={styles.actionButton} backgroundColor={styles.actionButtonOut.backgroundColor}/>
                // )
                // actions.push(
                //   <CommonRaisedButton label="打单据" primary={true} key={house._id+'in'}
                //     style={styles.actionButton} onTouchTap={this.checkInClick(house.floor, house.room).bind(this)}/>
                // )
                
                actions.push(
                  <button key={house._id+'out'} style={styles.button} 
                    onTouchTap={null}>退房</button>
                )
                actions.push(
                  <button key={house._id+'print'} style={styles.button} 
                    onTouchTap={this.print(house.floor, house.room).bind(this)}>打印</button>
                )
              } else if (house.subscriberId) {
                state = '定'
                name = house.subscriberId.name
                mobile = house.subscriberId.mobile
                remark = house.subscriberId.remark + '（定金' + house.subscriberId.subscription+'元）'
                contractEndDate = new moment(house.subscriberId.expiredDate).format('YYYY.MM.DD')
                // actions.push(
                //   <CommonRaisedButton label="入住" primary={true} key={house._id+'in'}
                //     style={styles.actionButton} onTouchTap={this.checkInClick(house.floor, house.room).bind(this)}/>
                // )
                // actions.push(
                //   <CommonRaisedButton label="退定" primary={true} key={house._id+'out'}
                //     style={styles.actionButton} backgroundColor={styles.actionButtonOut.backgroundColor}/>
                // )
                actions.push(
                  <button key={house._id+'rent'} style={styles.button} 
                    onTouchTap={this.checkInClick(house.floor, house.room).bind(this)}>入住</button>
                )
                actions.push(
                  <button key={house._id+'out'} style={styles.button} 
                    onTouchTap={null}>退订</button>
                )
                actions.push(
                  <button key={house._id+'print'} style={styles.button} 
                    onTouchTap={this.print(house.floor, house.room).bind(this)}>打印</button>
                )
              } else {
                // actions.push(
                //   <CommonRaisedButton label="入住" primary={true} key={house._id+'in'}
                //     style={styles.actionButton} onTouchTap={this.checkInClick(house.floor, house.room).bind(this)}/>
                // )
                // actions.push(
                //   <CommonRaisedButton label="预定" primary={true} key={house._id+'subs'}
                //     style={styles.actionButton} backgroundColor={styles.actionButtonSubs.backgroundColor}/>
                // )
                actions.push(
                  <button key={house._id+'in'} style={styles.button} 
                    onTouchTap={this.checkInClick(house.floor, house.room).bind(this)}>入住</button>
                )
                actions.push(
                  <button key={house._id+'subs'} style={styles.button} 
                    onTouchTap={this.subscribeClick(house.floor, house.room).bind(this)}>预定</button>
                )
                actions.push(
                  <button key={house._id+'print'} style={styles.button} 
                    onTouchTap={this.print(house.floor, house.room).bind(this)}>打印</button>
                )
              }

              return (
                <tr className={idx%2===0? 'tr odd': 'tr even'} key={'houses:'+house+':'+idx}>
                  <td className='td'> 
                    <div style={{display: 'flex', alignItems: 'center', minHeight: '75px'}} >
                      {house.floor+1}
                    </div>
                  </td>
                  <td className='td'> 
                    {house.room+1}
                  </td>
                  <td className='td'> 
                    { houseLayoutsObj[house.houseLayout].description }
                  </td>
                  <td className='td'> 
                    { state }
                  </td>
                  <td className='td'> 
                    { name }
                  </td>
                  <td className='td'> 
                    { mobile }
                  </td>
                  <td className='td'> 
                    { house.electricMeterEndNumber }
                  </td>
                  <td className='td'> 
                    { house.waterMeterEndNumber }
                  </td>
                  <td className='td'> 
                    { rentalEndDate }
                  </td>
                  <td className='td'> 
                    { contractEndDate }
                  </td>
                  <td className='td'> 
                    { remark }
                  </td>
                  <td className='td'> 
                    { actions }
                  </td>
                </tr>
              )
              })
            }
            </tbody>
          </table>
        </div>
        <HousesCheckIn mansion={state.mansion} houseLayouts={state.houseLayouts} house={checkInHouse} open={state.checkInOpen} 
            ok={this.checkInOk.bind(this)} cancel={this.checkInCancel.bind(this)} openToast={props.actions.openToast}/>
        <HousesPayRent mansion={state.mansion} houseLayouts={state.houseLayouts} house={payRentHouse} open={state.payRentOpen} 
            ok={this.payRentOk.bind(this)} cancel={this.payRentCancel.bind(this)} openToast={props.actions.openToast}/>
        <HousesSubscribe mansion={state.mansion} houseLayouts={state.houseLayouts} house={subscribeHouse} open={state.subscribeOpen} 
            ok={this.subscribeOk.bind(this)} cancel={this.subscribeCancel.bind(this)} openToast={props.actions.openToast}/>
        <HousesRepay mansion={state.mansion} houseLayouts={state.houseLayouts} house={repayHouse} open={state.repayOpen} 
            ok={this.repayOk.bind(this)} cancel={this.repayCancel.bind(this)} openToast={props.actions.openToast}/>
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
    var styles = {
      tab: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '30px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
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
        fontSize: '15px',
        whiteSpace: 'nowrap',
        marginRight: '56px',
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
      actionButton: {
        minWidth: '46px',
        margin: '2px',
      },
      button: {
        border: '10px',
        fontFamily: 'Roboto, sans-serif',
        cursor: 'pointer',
        backgroundColor: '#2196f3',
        overflow: 'hidden',
        borderRadius: '2px',
        fontSize: '14px',
        color: 'white',
        padding: '6px 10px',
        marginLeft: '4px',
        marginRight: '4px',
      },
    }
    styles.actionButtonRent = _.assign({}, styles.actionButton, {backgroundColor: '#2196f3'})
    styles.actionButtonSubs = _.assign({}, styles.actionButton, {backgroundColor: '#43a047'})
    styles.actionButtonOut = _.assign({}, styles.actionButton, {backgroundColor: '#009688'})
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    user: state.user.user,
    // users: state.users,
    // houseLayoutPatterns: state.houseLayoutPatterns,
    mansions: state.mansions
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, MansionsAction, UsersActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Houses);















