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

      showHouse: 'all',

      floor: [],
      forceUpdate: true,
      showTab: "all",
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
   * 取得物业的出租房、商铺信息
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
   * 切换显示的房间类型
   */
  onShowTabChange(e, value) {
    this.setState({showTab: value})
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
            return house.subscriber
          })
          break;
      }
    } 
    return houses;
  }

  // getHouseLayoutDescription(houseLayoutId) {
  //   return 
  // }

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
                <th style={{width: '5%'}} className='th'>楼层</th>
                <th style={{width: '5%'}} className='th'>房间</th>
                <th style={{width: '12%'}} className='th'>户型</th>
                <th style={{width: '5%'}} className='th'>状态</th>
                <th style={{width: '8%'}} className='th'>姓名</th>
                <th style={{width: '12%'}} className='th'>手机</th>
                <th style={{width: '10%'}} className='th'>下次交租</th>
                <th style={{width: '10%'}} className='th'>合同终止</th>
                <th className='th'>备注</th>
                <th style={{width: '15%'}} className='th'>操作</th>
              </tr>
            </thead>
            <tbody className='tbody'>
            {houses.map((house, idx) => {
              var keyString = (''+house.floor)+house.room
              var state = '空'
              var name = ''
              var mobile = ''
              var oweRentalExpiredDate = ''
              var contractEndDate = ''
              // {manager.createdAt? new Date(manager.createdAt).toLocaleDateString(): ''}
              if (house.tenantId) {
                state = '租'
                name = house.tenantId.name
                mobile = house.tenantId.mobile
                oweRentalExpiredDate = new moment(house.tenantId.oweRentalExpiredDate).format('YYYY.MM.DD')
                contractEndDate = new moment(house.tenantId.contractEndDate).format('YYYY.MM.DD')
              } else if (house.subscriberId) {
                state = '定'
                name = house.subscriberId.name
                mobile = house.subscriberId.mobile
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
                    { oweRentalExpiredDate }
                  </td>
                  <td className='td'> 
                    { contractEndDate }
                  </td>
                  <td className='td'> 
                    
                  </td>
                  <td className='td'> 
                    
                  </td>
                </tr>
              )
              })
            }
            </tbody>
          </table>
        </div>
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
    }
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















