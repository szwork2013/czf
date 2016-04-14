'use strict';
import log from '../../utils/log'
import _ from 'lodash'


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
      okDisabled: true,

      house: {},
      houseLayout: {},
      forceUpdate: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.forceUpdate) return true;
    let props = this.props
    // log.info(_.isEqual(nextProps.house, props.house) && _.isEqual(nextState.house, this.state.house) && nextProps.open === props.open)
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
    var house = _.clone(props.house)
    var disabled = false
    var houseLayout = houseLayouts.find( houseLayout => { return houseLayout._id === house.houseLayout})
    var tenant = _.pick(house, ['mansionId', 'floor', 'room', ]) || {}
    tenant.houseId = house._id
    tenant.type = 'in'

    if (!house.tenantId) {
      disabled = false
      house.tenantId = tenant
      tenant.rentalStartDate = new Date()
      tenant.rentalEndDate = new moment(tenant.rentalStartDate).add(1, 'M').subtract(1, 'day').toDate()
      tenant.contractStartDate = tenant.rentalStartDate
      tenant.contractEndDate = new moment(tenant.contractStartDate).add(1, 'Y').toDate()
      tenant.electricMeterEndNumber = house.electricMeterEndNumber
      tenant.waterMeterEndNumber = house.waterMeterEndNumber
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
      // tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
      // tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh
      // tenant.waterTons = 0
      // tenant.electricKWhs = 0
      tenant.isOwnRental = false
      tenant.oweRental = 0
      tenant.oweRentalExpiredDate = new moment(tenant.rentalStartDate).add(7, 'day').toDate()

      tenant.summed = {}
      tenant.summed.total = 0;

      // log.info(tenant.oweRentalExpiredDate)
    } else {
      disabled = true
      tenant = house.tenantId
      tenant.rentalStartDate = new Date(tenant.rentalStartDate)
      tenant.rentalEndDate = new Date(tenant.rentalEndDate)
      tenant.contractStartDate = new Date(tenant.contractStartDate)
      tenant.contractEndDate = new Date(tenant.contractEndDate)
      tenant.deposit = tenant.deposit || 0
      tenant.rental = tenant.rental || 0
      tenant.subscription = tenant.subscription || 0
      tenant.servicesCharges = tenant.servicesCharges || 0
      tenant.isOwnRental = tenant.oweRental>0 ? true: false
      tenant.oweRental = tenant.oweRental || 0

      tenant.summed = tenant.summed || {}
      tenant.summed.total = tenant.summed.total || 0;
    }
    this.setState({house, houseLayout, disabled})
    this.calcAll(house)
  }

  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var house = this.state.house
      var tenant = house.tenantId
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      } 
      tenant[key] = value
      this.setState({house, forceUpdate: true})
      this.calcAll()
    }
  }
  datePickerChange(key) {
    return function(e, value) {
      var house = this.state.house
      var tenant = house.tenantId
      tenant[key] = value
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
    var house = house || this.state.house
    var tenant = house.tenantId
    var summed = tenant.summed || {}
    summed.subscription = tenant.subscription || 0
    summed.deposit = tenant.deposit
    summed.rental = tenant.rental
    // summed.waterCharges = 0
    // summed.electricCharges = 0
    summed.servicesCharges = tenant.servicesCharges
    // summed.compensation = 0
    log.info(summed.deposit ,summed.rental ,summed.servicesCharges , summed.subscription)
    summed.total = summed.deposit + summed.rental + summed.servicesCharges - summed.subscription
    this.setState({house, forceUpdate: true})
  }
  print() {

  }

  ok() {
    if(this.props.ok) {
      this.props.ok(this.state.house)
    }
  }
  cancel() {
    if(this.props.cancel) {
      this.props.cancel(this.state.house)
    }
  }

  checkTenant() {

  }


  render() {
    var styles = this.getStyles()
    var state = this.state
    // var props = this.props
    var houseLayout = state.houseLayout || {}
    var house = state.house
    var tenant = house.tenantId
    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate
    // var contractStartDate = tenant.contractStartDate? new Date(tenant.contractStartDate): new Date()
    // var contractEndDate = tenant.contractEndDate? new Date(tenant.contractEndDate): new moment(contractStartDate).add(1, 'Y').toDate()
    // var rentalEndDate = tenant.rentalEndDate? new Date(tenant.rentalEndDate): new moment().add(1, 'M').toDate()

    return (
      <Dialog title={'登记：'+(house.floor+1)+'楼'+(house.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}}>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={tenant.name} disabled={disabled} floatingLabelText='姓名' hintText='姓名' 
            style={styles.textField} onChange={this.commonTextFiledChange('name').bind(this)} ref='name'/>
          <CommonTextField defaultValue={tenant.mobile} disabled={disabled} floatingLabelText='手机号' hintText='手机号' 
            style={styles.textField} onChange={this.commonTextFiledChange('mobile').bind(this)}/>
          <CommonTextField defaultValue={tenant.idNo} disabled={disabled} floatingLabelText='身份证' hintText='身份证' 
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('idNo').bind(this)}/>
          <br />
          
          <DatePicker value={tenant.contractStartDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='合同开始日期' hintText='合同开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractStartDate').bind(this)}/>
          <DatePicker value={tenant.contractEndDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='合同结束日期' hintText='合同结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractEndDate').bind(this)}/>
          <DatePicker value={tenant.rentalEndDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='下次交租日期' hintText='下次交租日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('rentalEndDate').bind(this)}/>
          <br />

          <CommonTextField value={tenant.deposit} disabled={disabled} floatingLabelText='押金' hintText='押金' 
            style={styles.textField} onChange={this.commonTextFiledChange('deposit', true).bind(this)}/>
          <CommonTextField value={tenant.rental} disabled={disabled} floatingLabelText='租金' hintText='租金' 
            style={styles.textField} onChange={this.commonTextFiledChange('rental', true).bind(this)}/>
          <CommonTextField value={tenant.servicesCharges} disabled={disabled} floatingLabelText='管理费' hintText='管理费' 
            style={styles.textField} onChange={this.commonTextFiledChange('servicesCharges', true).bind(this)}/>
          <CommonTextField value={tenant.subscription} disabled={true} floatingLabelText='已收定金' hintText='已收定金' 
            style={tenant.subscriberId? styles.textField: _.assign({}, styles.textField, {display: 'none'})}/>

          <br />
          <Checkbox defaultChecked={tenant.isOwnRental} label="欠租金" 
            style={styles.checkbox} onCheck={this.checkboxChange('isOwnRental').bind(this)}/>
          <CommonTextField value={tenant.oweRental} disabled={disabled} floatingLabelText='欠租金' hintText='欠租金' forceUpdate={forceUpdate}
            style={tenant.isOwnRental? styles.textField: _.assign({}, styles.textField, {display: 'none'})} 
            onChange={this.commonTextFiledChange('oweRental', true).bind(this)}/>
          <DatePicker value={tenant.oweRentalExpiredDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='租金补齐日期' hintText='租金补齐日期' autoOk={true}
            style={tenant.isOwnRental? styles.dataPicker: _.assign({}, styles.dataPicker, {display: 'none'})} 
            wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('oweRentalExpiredDate').bind(this)}/>

          <br />
          <CommonTextField value={tenant.electricMeterEndNumber} disabled={disabled} floatingLabelText='电表底数' hintText='电表底数' 
            style={styles.textField} onChange={this.commonTextFiledChange('electricMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.waterMeterEndNumber} disabled={disabled} floatingLabelText='水表底数' hintText='水表底数' 
            style={styles.textField} onChange={this.commonTextFiledChange('waterMeterEndNumber', true).bind(this)}/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '365px'}}>
          <div style={{height: '280px'}}>
          押金：{tenant.deposit}<br />
          租金：{tenant.rental}<br />
          管理费：{tenant.servicesCharges}<br />
          { tenant.isOwnRental && (
              <span>欠租金：{tenant.oweRental}<br /></span>
          )}
          { tenant.subscriberId && (
              <span>定金：{tenant.subscription}<br /></span>
          )}
          
          </div>
          <span style={{display: 'inline-block', minWidth: '150px', marginBottom: '10px', marginTop: '10px'}}>
            总计：<span style={{color: 'red'}}>{tenant.summed.total}</span> 元
          </span>
          
          <RaisedButton label="打印单据" primary={true} style={{}} onTouchTap={this.print.bind(this)} disabled={disabled} fullWidth={true}/>
        </div>
        <div style={{clear: 'both'}}></div>
        <div style={{width: '100%', textAlign: 'right', paddingTop: '20px', marginTop: '10px', borderTop: '1px solid #e0e0e0'}}>
          <RaisedButton label="确定" primary={true} style={styles.marginRight} onTouchTap={this.ok.bind(this)} disabled={state.okDisabled}/>
          <RaisedButton label="取消" primary={true} style={styles.marginRight} onTouchTap={this.cancel.bind(this)}/>
        </div>
      </Dialog>
    )
  }

  getStyles() {
    var styles = {
      contentStyle: {
        // paddingTop: '20px',
        maxHeight: '9999px',
        overflow: 'auto',
      },
      marginRight: {
        marginRight: '20px',
      },
    }
    styles.textField = _.assign({}, styles.marginRight, {width: '130px', overflow: 'hidden',})
    styles.textFieldLong = _.assign({}, styles.marginRight, {width: '180px', overflow: 'hidden',})
    styles.dataPicker = _.assign({}, styles.textField, {display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden'})
    styles.checkbox = _.assign({}, styles.marginRight, {width: '130px', display: 'inline-block', whiteSpace: 'nowrap', fontSize: '15px', top: '30px', minHeight: '72px'})
    return styles
  }
}

export default HousesCheckIn;