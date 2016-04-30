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
         Checkbox, RadioButtonGroup, RadioButton, DatePicker } from 'material-ui/lib'

import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';
import * as UsersActions from '../../actions/users';


import CommonRadioButtonGroup from '../../components/common/common_radio_button_group'
import CommonSelectField from '../../components/common/common_select_field'
import CommonRaisedButton from '../../components/common/common_raised_button'
import CommonTextField from '../../components/common/common_text_field'



// import CommonConfirmDialog from '../../components/common/common_confirm_dialog'


class StatisticsHouses extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {},
      beginDate: new moment().startOf('day').toDate(),
      endDate: new moment().endOf('day').toDate(),
      forceUpdate: true,
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
      this.selectDefaultMansion(this.props.mansions)
    }
  }

  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    this.state.forceUpdate = true         //删除时需要
    this.setState({forceUpdate: true})
    //物业单位默认选择第一个
    this.selectDefaultMansion(nextProps.mansions)
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
  selectDefaultMansion(mansions) {
    if (_.isEmpty(this.state.mansion) && mansions.length>0) {
      for (let key in mansions) {
        this.selectMansion(mansions[key])
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
        this.selectMansion(mansions[this.state.mansion._id])
        return
      }
    }
  }
  selectMansion(mansion) {    
    this.setState({mansion})
  }

  // /*
  //  * 将扁平化的houses格式化成floor
  //  */
  // buildFloor(mansion, houses) {
  //   var floor = []

  //   houses.forEach((house, idx) => {
  //     if (!floor[house.floor]) floor[house.floor] = [];
  //     house.__idx = idx;
  //     floor[house.floor][house.room] = house;
  //   })
  //   for (var i=0; i<mansion.floorCount; i++) {
  //     if (!floor[i]) floor[i] = []
  //   }
  //   return floor
  // }


  /*
   * 选择物业单位
   */
  handleMansionsChange(value) {
    this.state.forceUpdate = true
    this.setState({forceUpdate: true})
    this.selectMansion(this.props.mansions[value])

  }
  datePickerChange(key, startOrEnd='endOf') {
    return function(e, value) {
      var obj = {forceUpdate: true}
      obj[key] = new moment(value)[startOrEnd]('day').toDate()
      this.setState(obj)
    }
  }
  search() {
    var state = this.state
    if (!state.mansion) return;
    let formData = {mansionId: state.mansion._id,  beginDate: state.beginDate, endDate: state.endDate}
    if (!_.isEmpty(formData)) {
      this.props.actions.getChargesClick(formData);
    }
  }


  /*
   * 操作
   */
  exportToExcel() {
    var state = this.state
    var mansion = state.mansion;

  }

  print() {
    return function(e) {
      // window.printArea.innerHTML = printTemplate.buildHtmlStr(this.state.mansion, this.state.floor[floorIdx][houseIdx])
      // window.print()
    }
  }

  getCharges() {
    var state = this.state
    var mansion = state.mansion;
    var charges = mansion.charges || []

    return charges;
  }

  formatDate(date) {
    return new moment(date).format('YYYY/MM/DD')
  }
  render() {
    var now = new Date()
    var styles = this.getStyles()
    var props = this.props
    var state = this.state

    var forceUpdate = state.forceUpdate
    var mansion = state.mansion;
    var charges = this.getCharges();
    var summed = 0
    charges.forEach( charge => {
      summed += charge.summed
    })
    summed = summed.toFixed(1)

    var wordings = {ok: '确定', cancel: '取消'}

    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <CommonSelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)} style={styles.marginRight}
              floatingLabelText='物业单位' forceUpdate={forceUpdate}
              items={props.mansions} itemValue='_id' itemPrimaryText='name' itemKey='_id' excludeKey={['length']} fullWidth={false}/>
          <RaisedButton label="查询" primary={true} style={{width: '195px', marginBottom: '8px'}} onTouchTap={this.search.bind(this)} />
          
          <br />
          <DatePicker value={state.beginDate} formatDate={this.formatDate}
            floatingLabelText='开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('beginDate', 'startOf').bind(this)}/>
          <DatePicker value={state.endDate} formatDate={this.formatDate}
            floatingLabelText='结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('endDate', 'endOf').bind(this)}/>
          
        </div>
        <div style={styles.tab}>
          <span style={{fontSize: '24px', float: 'right', margin: '10px'}}>总计：<span style={{color: 'red'}}>{summed}</span> 元</span>
          <table className='table'>
            <thead className='thead'>
              <tr className='tr'>
                <th style={{width: '4.5%'}} className='th'>楼层</th>
                <th style={{width: '4.5%'}} className='th'>房间</th>
                <th style={{width: '8%'}} className='th'>类型</th>
                <th style={{width: '6%'}} className='th'>定金</th>
                <th style={{width: '6%'}} className='th'>押金</th>
                <th style={{width: '6%'}} className='th'>租金</th>
                <th style={{width: '6%'}} className='th'>电费</th>
                <th style={{width: '6%'}} className='th'>水费</th>
                <th style={{width: '6%'}} className='th'>物业</th>
                <th style={{width: '6%'}} className='th'>门卡</th>
                <th className='th'>备注</th>
                <th style={{width: '10%'}} className='th'>日期</th>
                <th style={{width: '7%'}} className='th'>总计</th>
              </tr>
            </thead>
            <tbody className='tbody'>
            {charges.map((charge, idx) => {
              var type = ''
              var subscription = ''
              var deposit = ''
              var rental = ''
              var doorCardCharges = ''
              var remark = charge.remark
              switch (charge.type) {
                case 'subscribe':
                  type = '定房'
                  subscription = charge.subscription
                  break;
                case 'unsubscribe':
                  type = '退定'
                  subscription = -charge.refund
                  break;
                case 'checkin':
                  type = '入住'
                  rental = charge.rental
                  deposit = charge.deposit
                  subscription = charge.refund? -charge.refund: ''
                  doorCardCharges = charge.doorCardCharges
                  if (charge.oweRental) {
                    remark += '（欠款：'+charge.oweRental+'元）'
                  }
                  break;
                case 'repay':
                  type = '补租'
                  rental = charge.oweRentalRepay
                  break;
                case 'rental':
                  type = '交租'
                  deposit = charge.changeDeposit? charge.changeDeposit: ''
                  rental = charge.rental
                  if (charge.oweRental) {
                    remark += '（欠款：'+charge.oweRental+'元）'
                  }
                  break;
                case 'checkout':
                  type = '退房'
                  deposit = -charge.deposit
                  doorCardCharges = -charge.doorCardRecoverCharges
                  if (charge.oweRentalRepay) {
                    remark += '（补交欠款：'+charge.oweRentalRepay+'元）'
                  }
                  if (charge.overdueCharges) {
                    remark += '（逾期罚款：'+charge.overdueCharges+'元）'
                  }
                  if (charge.compensation) {
                    remark += '（损坏赔偿：'+charge.compensation+'元）'
                  }
                  break;
                case 'doorcard':
                  type = '门卡'
                  doorCardCharges = charge.doorCardCharges || -charge.doorCardRecoverCharges
                  break;
                break;
              }
              return (
                <tr className={idx%2===0? 'tr odd': 'tr even'} key={charges._id}>
                  <td className='td'> 
                    <div style={{display: 'flex', alignItems: 'center', minHeight: '75px'}} >
                      {charge.floor+1}
                    </div>
                  </td>
                  <td className='td'> 
                    {charge.room+1}
                  </td>
                  <td className='td'> 
                    {type}
                  </td>
                  <td className='td'> 
                    {subscription}
                  </td>
                  <td className='td'> 
                    { deposit }
                  </td>
                  <td className='td'> 
                    { rental }
                  </td>
                  <td className='td'> 
                    { charge.electricCharges }
                  </td>
                  <td className='td'> 
                    { charge.waterCharges }
                  </td>
                  <td className='td'> 
                    { charge.servicesCharges }
                  </td>
                  <td className='td'> 
                    { doorCardCharges }
                  </td>
                  <td className='td' style={{whiteSpace: 'normal'}}> 
                    { remark }
                  </td>
                  <td className='td'> 
                    {new moment(charge.createdAt).format('YYYY/MM/DD')}
                  </td>
                  <td className='td'> 
                    {charge.summed}
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
        padding: '6px 6px',
        marginLeft: '2px',
        marginRight: '2px',
      },

    }
    // styles.textField = _.assign({}, styles.marginRight, {width: '130px', overflow: 'hidden',})
    styles.dataPicker = _.assign({}, styles.marginRight, {display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden'})
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
)(StatisticsHouses);















