'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'
import IDCard from '../../../utils/identitycard'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';
import moment from 'moment'

import { Dialog, RaisedButton, Divider, TextField, DatePicker, Checkbox } from 'material-ui/lib'
import CommonTextField from '../common/common_text_field'


class HousesCheckIn extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      okDisable: false,
      printDisabled: true,

      house: {},
      houseLayout: {},
      forceUpdate: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.forceUpdate) return true;
    let props = this.props
    if (_.isEqual(nextProps.house, props.house) && nextProps.open === props.open) {
      return false;
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
  }

  componentWillMount() {
    this.stateHouse(this.props)  
  }
  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    this.stateHouse(nextProps)  
  }

  stateHouse(props) {
    var mansion = props.mansion
    var houseLayouts = props.houseLayouts
    var house = _.cloneDeep(props.house)
    var disabled = false
    var houseLayout = houseLayouts.find( houseLayout => { return houseLayout._id === house.houseLayout})
    var tenant = {}
    if (!house.tenantId) {
      disabled = props.disabled!==undefined? props.disabled: false
      tenant = _.pick(house, ['mansionId', 'floor', 'room', ]) || {}
      house.tenantId = tenant
      tenant.houseId = house._id
      tenant.type = 'in'
      tenant.rentalStartDate = new moment().startOf('day').toDate()
      tenant.rentalEndDate = new moment(tenant.rentalStartDate).add(1, 'M').subtract(1, 'day').endOf('day').toDate()
      tenant.contractStartDate = tenant.rentalStartDate
      tenant.contractEndDate = new moment(tenant.contractStartDate).add(1, 'Y').subtract(1, 'day').endOf('day').toDate()
      tenant.electricMeterEndNumber = house.electricMeterEndNumber
      tenant.waterMeterEndNumber = house.waterMeterEndNumber
      tenant.electricCharges = 0
      tenant.waterCharges = 0
      tenant.subscription = 0
      tenant.doorCardCount = 0
      if (house.subscriberId) {
        var subscriber = house.subscriberId
        tenant.subscriberId = subscriber._id
        tenant.subscription = subscriber.subscription || 0
        tenant.name = subscriber.name
        tenant.mobile = subscriber.mobile
        tenant.idNo = subscriber.idNo
      }
      if (houseLayout) {
        tenant.deposit = houseLayout.defaultDeposit
        tenant.rental = houseLayout.defaultRental
        tenant.servicesCharges = houseLayout.servicesCharges
      } else {
        tenant.deposit = 0
        tenant.rental = 0
        tenant.servicesCharges = 0
      }
      tenant.isOweRental = false
      tenant.oweRental = 0
      tenant.oweRentalExpiredDate = new moment(tenant.rentalStartDate).add(7, 'day').endOf('day').toDate()

      tenant.summed = 0
      this.setState({okDisable: false, printDisabled: true})
      this.calcAll(house)
    } else {
      disabled = props.disabled!==undefined? props.disabled: true
      tenant = house.tenantId
      tenant.rentalStartDate = new Date(tenant.rentalStartDate)
      tenant.rentalEndDate = new Date(tenant.rentalEndDate)
      tenant.contractStartDate = new Date(tenant.contractStartDate)
      tenant.contractEndDate = new Date(tenant.contractEndDate)
      tenant.deposit = tenant.deposit || 0
      tenant.rental = tenant.rental || 0
      tenant.subscription = tenant.subscription || 0
      tenant.servicesCharges = tenant.servicesCharges || 0
      tenant.electricCharges = tenant.electricCharges || 0
      tenant.waterCharges = tenant.waterCharges || 0
      tenant.isOweRental = tenant.oweRental>0 ? true: false
      tenant.oweRental = tenant.oweRental || 0
      if (tenant.isOweRental) {
        tenant.oweRentalExpiredDate = new Date(tenant.oweRentalExpiredDate)
      }
      tenant.electricMeterEndNumber = tenant.electricMeterEndNumber || 0
      tenant.waterMeterEndNumber = tenant.waterMeterEndNumber || 0
      tenant.summed = tenant.summed || 0
      this.setState({okDisable: true, printDisabled: false})
    }
    // log.info(house)
    this.setState({house, houseLayout, disabled})
  }

  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var house = this.state.house
      var tenant = house.tenantId
      // if (isNumber) {
      //   value = Number(value)
      //   if (isNaN(value)) 
      //     value = 0
      //   if (value<0)
      //     value = -value
      // } 
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        tenant[key] = value
        this.setState({house, forceUpdate: true})
        this.calcAll()
      }
    }
  }
  datePickerChange(key, startOrEnd='endOf') {
    return function(e, value) {
      var house = this.state.house
      var tenant = house.tenantId
      tenant[key] = new moment(value)[startOrEnd]('day').toDate()
      this.setState({house, forceUpdate: true})
    }
  }
  checkboxChange(key) {
    return function(e, value) {
      var house = this.state.house
      var tenant = house.tenantId
      tenant[key] = value
      this.setState({house, forceUpdate: true})
    }
  }

  formatDate(date) {
    return new moment(date).format('YYYY/MM/DD')
  }

  calcAll(house) {
    var mansion = this.props.mansion
    var house = house || this.state.house
    var tenant = house.tenantId
    // log.info(tenant.deposit ,tenant.rental ,tenant.servicesCharges , tenant.subscription)
    tenant.summed = Number(tenant.deposit) + Number(tenant.rental) + Number(tenant.servicesCharges) - Number(tenant.subscription) +
      (Number(tenant.doorCardCount) * mansion.doorCardSellCharges)
    this.setState({house, forceUpdate: true})
  }
  print() {

  }

  ok() {
    var openToast = this.props.openToast || function() {}
    var house = this.state.house
    var tenant = house.tenantId

    if (!tenant.name) return openToast({msg: '姓名不能为空'})
    if (!tenant.mobile) return openToast({msg: '手机号不能为空'})
    if (!utils.isMobileNumber(tenant.mobile)) return openToast({msg: '手机号格式错误'})
    if (tenant.idNo && !IDCard.IDIsValid(tenant.idNo)) return openToast({msg: '身份证格式错误'})

    if (!utils.parseDate(tenant.contractStartDate)) return openToast({msg: '请选择合同开始日期'})
    if (!utils.parseDate(tenant.contractEndDate)) return openToast({msg: '请选择合同结束日期'})
    if (!utils.parseDate(tenant.rentalStartDate)) return openToast({msg: '请选择本次交租日期'})
    if (!utils.parseDate(tenant.rentalEndDate)) return openToast({msg: '请选择下次交租日期'})

    if (tenant.deposit==='' || tenant.deposit===undefined) return openToast({msg: '请输入押金'})
    if (tenant.rental==='' || tenant.rental===undefined) return openToast({msg: '请输入租金'})
    if (tenant.servicesCharges==='' || tenant.servicesCharges===undefined) return openToast({msg: '请输入管理费'})
    if (tenant.isOweRental) {
      if (tenant.oweRental==='' || tenant.oweRental===undefined) return openToast({msg: '请输入欠租金'})
      if (!utils.parseDate(tenant.oweRentalExpiredDate)) return openToast({msg: '请选择租金补齐日期'})
    } 

    if (tenant.electricMeterEndNumber==='' || tenant.electricMeterEndNumber===undefined) return openToast({msg: '请输入电表底数'})
    if (tenant.waterMeterEndNumber==='' || tenant.waterMeterEndNumber===undefined) return openToast({msg: '请输入水表底数'})
    if (tenant.doorCardCount==='' || tenant.doorCardCount===undefined) return openToast({msg: '请输入购门卡数'})

    tenant.deposit = Number(tenant.deposit)
    if (isNaN(tenant.deposit)) tenant.deposit = ''
    tenant.rental = Number(tenant.rental)
    if (isNaN(tenant.rental)) tenant.rental = ''
    tenant.servicesCharges = Number(tenant.servicesCharges)
    if (isNaN(tenant.servicesCharges)) tenant.servicesCharges = ''
    tenant.electricMeterEndNumber = Number(tenant.electricMeterEndNumber)
    if (isNaN(tenant.electricMeterEndNumber)) tenant.electricMeterEndNumber = ''
    tenant.waterMeterEndNumber = Number(tenant.waterMeterEndNumber)
    if (isNaN(tenant.waterMeterEndNumber)) tenant.waterMeterEndNumber = ''
    tenant.doorCardCount = Number(tenant.doorCardCount)
    if (isNaN(tenant.doorCardCount)) tenant.doorCardCount = ''

    this.setState({tenant, forceUpdate: true})
  
    if (isNaN(tenant.summed)) {
      return openToast({msg: '非法数字，总计错误'})
    }

    if(this.props.ok) {
      this.props.ok(house)
    }
  }
  cancel() {
    if(this.props.cancel) {
      this.props.cancel(this.state.house)
    }
  }

  render() {

    var styles = this.getStyles()
    var state = this.state
    var props = this.props
    var houseLayout = state.houseLayout || {}
    var mansion = this.props.mansion
    var house = state.house
    var tenant = house.tenantId
    // tenant.servicesCharges = 0
    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate

    // tenant.name = tenant.name || 'Welkinm'
    // tenant.mobile = tenant.mobile || '13710248411'
    // log.info(tenant)
    return (
      <Dialog title={'入住登记：'+(house.floor+1)+'楼'+(house.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}}>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={tenant.name} disabled={disabled} floatingLabelText='姓名'
            style={styles.textField} onChange={this.commonTextFiledChange('name').bind(this)} ref='name'/>
          <CommonTextField value={tenant.mobile} disabled={disabled} floatingLabelText='手机号'  
            style={styles.textField} onChange={this.commonTextFiledChange('mobile').bind(this)}/>
          <CommonTextField value={tenant.idNo} disabled={disabled} floatingLabelText='身份证' 
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('idNo').bind(this)}/>
          <br />
          
          <DatePicker value={tenant.contractStartDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='合同开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractStartDate', 'startOf').bind(this)}/>
          <DatePicker value={tenant.contractEndDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='合同结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractEndDate', 'endOf').bind(this)}/>
          <DatePicker value={tenant.rentalEndDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='下次交租日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('rentalEndDate', 'endOf').bind(this)}/>
          <br />

          <CommonTextField value={tenant.deposit} disabled={disabled} floatingLabelText='押金' 
            style={styles.textField} onChange={this.commonTextFiledChange('deposit', true).bind(this)}/>
          <CommonTextField value={tenant.rental} disabled={disabled} floatingLabelText='租金' 
            style={styles.textField} onChange={this.commonTextFiledChange('rental', true).bind(this)}/>
          <CommonTextField value={tenant.servicesCharges} disabled={disabled} floatingLabelText='管理费' 
            style={styles.textField} onChange={this.commonTextFiledChange('servicesCharges', true).bind(this)}/>

          <br />
          <Checkbox defaultChecked={tenant.isOweRental} label="欠租金" disabled={disabled}
            style={styles.checkbox} onCheck={this.checkboxChange('isOweRental').bind(this)} />
          <CommonTextField value={tenant.oweRental} disabled={disabled} floatingLabelText='欠租金' forceUpdate={forceUpdate}
            style={tenant.isOweRental? styles.textField: _.assign({}, styles.textField, {display: 'none'})} 
            onChange={this.commonTextFiledChange('oweRental', true).bind(this)}/>
          <DatePicker value={tenant.oweRentalExpiredDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='租金补齐期限' autoOk={true}
            style={tenant.isOweRental? styles.dataPicker: _.assign({}, styles.dataPicker, {display: 'none'})} 
            wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('oweRentalExpiredDate', 'endOf').bind(this)}/>

          <br />
          <CommonTextField value={tenant.electricMeterEndNumber} disabled={disabled} 
            floatingLabelText={'电表底数:'+house.electricMeterEndNumber} 
            style={styles.textField} onChange={this.commonTextFiledChange('electricMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.waterMeterEndNumber} disabled={disabled} 
            floatingLabelText={'水表底数:'+house.waterMeterEndNumber} 
            style={styles.textField} onChange={this.commonTextFiledChange('waterMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.subscription} disabled={true} floatingLabelText='已收定金' 
            style={tenant.subscriberId? styles.textField: _.assign({}, styles.textField, {display: 'none'})}/>

          <br />
          <CommonTextField value={tenant.doorCardCount} disabled={disabled} floatingLabelText='购门卡数' forceUpdate={forceUpdate}
            style={styles.textField} onChange={this.commonTextFiledChange('doorCardCount', true).bind(this)}/>
          <CommonTextField defaultValue={tenant.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.twoColunmTextField} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '410px'}}>
          <div style={{height: '325px'}}>
          押金：{tenant.deposit}<br />
          租金：{tenant.rental}<br />
          电费：{tenant.electricCharges}<br />
          水费：{tenant.waterCharges}<br />
          管理费：{tenant.servicesCharges}<br />
          { tenant.subscriberId && (
              <span>定金：{-tenant.subscription}<br /></span>
          )}
          { Number(tenant.doorCardCount)>0 && (
              <span>门卡：{Number(tenant.doorCardCount) * mansion.doorCardSellCharges}<br /></span>
          )}
          
          </div>
          <span style={{display: 'inline-block', minWidth: '150px', marginBottom: '10px', marginTop: '10px'}}>
            总计：<span style={{color: 'red'}}>{tenant.summed}</span> 元
          </span>

          <RaisedButton label="确定" primary={true} style={styles.marginRight} onTouchTap={this.ok.bind(this)} disabled={state.okDisable}/>
          <RaisedButton label="打印单据" primary={true} style={{}} onTouchTap={this.print.bind(this)} disabled={state.printDisabled} />
        </div>
        <div style={{clear: 'both'}}></div>
        <div style={{width: '100%', textAlign: 'right', paddingTop: '20px', marginTop: '10px', borderTop: '1px solid #e0e0e0'}}>
          <RaisedButton label="关闭" style={styles.marginRight} onTouchTap={this.cancel.bind(this)}/>
        </div>
      </Dialog>
    )
  }

  getStyles() {
    var styles = {
      contentStyle: {
        maxHeight: '9999px',
        overflow: 'auto',
      },
      marginRight: {
        marginRight: '20px',
      },
      fullWidth: {
        width: '480px'
      },
    }
    styles.textField = _.assign({}, styles.marginRight, {width: '130px', overflow: 'hidden',})
    styles.twoColunmTextField = _.assign({}, styles.marginRight, {width: '280px', overflow: 'hidden',})
    styles.textFieldLong = _.assign({}, styles.marginRight, {width: '180px', overflow: 'hidden',})
    styles.dataPicker = _.assign({}, styles.textField, {display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden'})
    styles.checkbox = _.assign({}, styles.marginRight, {width: '130px', display: 'inline-block', whiteSpace: 'nowrap', fontSize: '15px', top: '30px', minHeight: '72px'})
    return styles
  }
}

export default HousesCheckIn;





