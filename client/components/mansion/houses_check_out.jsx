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


class HousesCheckOut extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      okDisable: false,
      printDisabled: true,

      house: {},
      houseLayout: {},
      changeDeposit: 0,
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
    var house = props.house || {}
    var disabled = false
    var houseLayout = houseLayouts.find( houseLayout => { return houseLayout._id === house.houseLayout})
    var stateHouse = this.state.house || {}
    var tenant = stateHouse.tenantId || {}
    if (!_.isEmpty(house)) {
      if (house.tenantId) {
        disabled = false
        if (_.isEmpty(stateHouse)) {
          stateHouse = _.cloneDeep(house)
          tenant = stateHouse.tenantId
          if (tenant.oweRental) {
            // 还欠上次租金的不允许交租，需要先补齐所欠租金
            // disabled = true
            tenant.isOweRental = true
            tenant.oweRentalExpiredDate = new Date(tenant.oweRentalExpiredDate)
            // this.setState({okDisable: true, printDisabled: true})
          }
          tenant._id
          tenant.subscription = 0
          delete tenant.subscriberId
          tenant.rental = 0
          tenant.rentalStartDate = new Date(tenant.rentalEndDate)
          tenant.rentalEndDate = new Date(tenant.rentalEndDate)
          tenant.contractStartDate = new Date(tenant.contractStartDate)
          tenant.contractEndDate = new Date(tenant.contractEndDate)
          tenant.electricMeterEndNumber
          tenant.waterMeterEndNumber
          tenant.waterTons = 0
          tenant.electricKWhs = 0
          tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh
          tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
          // tenant.isOweRental = false
          // tenant.oweRental = 0
          // tenant.oweRentalExpiredDate = new moment().add(7, 'day').toDate()
          tenant.servicesCharges = 0
          tenant.compensation = 0
          tenant.overdueDays = new moment().diff(tenant.rentalEndDate, 'days')
          if (tenant.overdueDays<0) tenant.overdueDays = 0
          tenant.overdueFinePerDay = 0
          if (houseLayout) {
            tenant.overdueFinePerDay = houseLayout.overdueFine
          }
          tenant.overdueCharges = tenant.overdueDays * tenant.overdueFinePerDay
          tenant.doorCardRecoverCount = tenant.doorCardCount || 0
          tenant.doorCardRecoverCharges = tenant.doorCardRecoverCount * mansion.doorCardRecoverCharges

          this.state.house = stateHouse
          this.setState({okDisable: false, printDisabled: true})
          this.calcAll(tenant)
        }
        this.setState({okDisable: false, printDisabled: true})
      } else {
        disabled = true
        this.setState({okDisable: true, printDisabled: false})
      }
    } else {
      stateHouse = {}
      disabled = props.disabled!==undefined? props.disabled: true
      this.setState({okDisable: true, printDisabled: true})
    }
    this.setState({house: stateHouse, houseLayout, disabled})
  }

  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var house = this.state.house || {}
      var tenant = house.tenantId || {}
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        tenant[key] = value
        this.setState({house, forceUpdate: true})
        this.calcAll()
      }
    }
  }
  datePickerChange(key) {
    return function(e, value) {
      var house = this.state.house || {}
      var tenant = house.tenantId || {}
      tenant[key] = value
      this.setState({house, forceUpdate: true})
    }
  }
  checkboxChange(key) {
    return function(e, value) {
      var house = this.state.house || {}
      var tenant = house.tenantId || {}
      tenant[key] = value
      this.setState({house, forceUpdate: true})
      this.calcAll()
    }
  }

  formatDate(date) {
    return new moment(date).format('YYYY/MM/DD')
  }

  calcAll(tenant) {
    var house = this.state.house || {}
    tenant = tenant || house.tenantId || {}
    // var house = this.props.house || {}
    var oldTenant = this.props.house.tenantId || {}
    var mansion = this.props.mansion
    
    //计算电费
    var tenantElectricMeterEndNumber = Number(tenant.electricMeterEndNumber)
    if (tenantElectricMeterEndNumber < house.electricMeterEndNumber) {
      var electricMeterMax = house.electricMeterMax? house.electricMeterMax: mansion.houseElectricMeterMax
      tenant.electricKWhs = electricMeterMax - house.electricMeterEndNumber + tenantElectricMeterEndNumber + 1
    } else {
      tenant.electricKWhs = tenantElectricMeterEndNumber - house.electricMeterEndNumber
    }
    //限制最小用电量
    if (mansion.houseElectricChargesMinimalKWhs && tenant.electricKWhs<mansion.houseElectricChargesMinimalKWhs) {
      tenant.electricCharges = mansion.houseElectricChargesMinimalKWhs * tenant.electricChargesPerKWh
    } else {
      tenant.electricCharges = tenant.electricKWhs * tenant.electricChargesPerKWh
    }
    tenant.electricCharges = Number(tenant.electricCharges.toFixed(1))
    

    //计算水费
    var tenantWaterMeterEndNumber = Number(tenant.waterMeterEndNumber)
    if (tenantWaterMeterEndNumber < house.waterMeterEndNumber) {
      var waterMeterMax = house.waterMeterMax || mansion.houseWaterMeterMax
      tenant.waterTons = waterMeterMax - house.waterMeterEndNumber + tenantWaterMeterEndNumber + 1
    } else {
      tenant.waterTons = tenantWaterMeterEndNumber - house.waterMeterEndNumber
    }
    //限制最小用水量
    if (mansion.houseWaterChargesMinimalTons && tenant.waterTons<mansion.houseWaterChargesMinimalTons) {
      tenant.waterCharges = mansion.houseWaterChargesMinimalTons * tenant.waterChargesPerTon
    } else {
      tenant.waterCharges = tenant.waterTons * tenant.waterChargesPerTon
    }
    tenant.waterCharges = Number(tenant.waterCharges.toFixed(1))

    // log.info(tenant.deposit ,tenant.rental ,tenant.servicesCharges , tenant.subscription)
    tenant.summed = Number(tenant.electricCharges) + Number(tenant.waterCharges) - Number(tenant.deposit)
    if (tenant.isOweRental) tenant.summed += Number(tenant.oweRental)
    if (Number(tenant.doorCardRecoverCount)>0) {
      tenant.doorCardRecoverCharges = Number(tenant.doorCardRecoverCount)*mansion.doorCardRecoverCharges
      tenant.summed -= tenant.doorCardRecoverCharges
    }
    tenant.summed += Number(tenant.overdueCharges) + Number(tenant.compensation)
    
    tenant.summed = Number(tenant.summed.toFixed(1))

    this.setState({house, forceUpdate: true})
  }
  print() {

  }

  ok() {
    var openToast = this.props.openToast || function() {}
    var house = this.state.house || {}
    var tenant = house.tenantId || {}

    if (tenant.electricMeterEndNumber==='' || tenant.electricMeterEndNumber===undefined) return openToast({msg: '请输入电表读数'})
    if (tenant.waterMeterEndNumber==='' || tenant.waterMeterEndNumber===undefined) return openToast({msg: '请输入水表读数'})

    
    tenant.electricMeterEndNumber = Number(tenant.electricMeterEndNumber)
    if (isNaN(tenant.electricMeterEndNumber)) tenant.electricMeterEndNumber = ''
    tenant.waterMeterEndNumber = Number(tenant.waterMeterEndNumber)
    if (isNaN(tenant.waterMeterEndNumber)) tenant.waterMeterEndNumber = ''
    tenant.doorCardRecoverCount = Number(tenant.doorCardRecoverCount)
    if (isNaN(tenant.doorCardRecoverCount)) tenant.doorCardRecoverCount = ''
    tenant.doorCardRecoverCharges = Number(tenant.doorCardRecoverCharges)
    if (isNaN(tenant.doorCardRecoverCharges)) tenant.doorCardRecoverCharges = ''
    tenant.overdueCharges = Number(tenant.overdueCharges)
    if (isNaN(tenant.overdueCharges)) tenant.overdueCharges = ''
    tenant.compensation = Number(tenant.compensation)
    if (isNaN(tenant.compensation)) tenant.compensation = ''
  
    this.setState({house, forceUpdate: true})
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
    var house = props.house || {}
    var oldTenant = house.tenantId || {}
    var stateHouse = this.state.house || {}
    var tenant = stateHouse.tenantId || {}
    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate
    var changeDeposit = state.changeDeposit

    return (
      <Dialog title={'退房：'+(tenant.floor+1)+'楼'+(tenant.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}}>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField value={tenant.name} disabled={true} floatingLabelText='姓名' style={styles.textField} />
          <CommonTextField value={tenant.mobile} disabled={true} floatingLabelText='手机号' style={styles.textField} />
          <CommonTextField value={tenant.idNo} disabled={true} floatingLabelText='身份证' style={styles.textFieldLong} />
          <br />
          
          <DatePicker value={tenant.contractStartDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat} />
          <DatePicker value={tenant.contractEndDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat} />
          <DatePicker value={new Date(tenant.rentalEndDate)} disabled={true} formatDate={this.formatDate}
            floatingLabelText='上次交租期限' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <br />

          <CommonTextField value={tenant.electricMeterEndNumber} disabled={disabled} 
            floatingLabelText={'电表底数:'+house.electricMeterEndNumber}
            style={styles.textField} onChange={this.commonTextFiledChange('electricMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.waterMeterEndNumber} disabled={disabled} 
            floatingLabelText={'水表底数:'+house.waterMeterEndNumber} 
            style={styles.textField} onChange={this.commonTextFiledChange('waterMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.deposit} disabled={true} floatingLabelText='押金' style={styles.textField}/>
          <br />

          <CommonTextField value={tenant.doorCardRecoverCount} disabled={disabled} floatingLabelText={'退门卡('+tenant.doorCardCount+'个)' }
            style={styles.textField} onChange={this.commonTextFiledChange('doorCardRecoverCount', true).bind(this)}/>
          <CommonTextField value={tenant.overdueCharges} disabled={disabled || tenant.overdueDays<=0} floatingLabelText={'逾期罚款('+tenant.overdueDays+'天)'}
            style={styles.textField} onChange={this.commonTextFiledChange('overdueCharges', true).bind(this)}/>
          <CommonTextField value={tenant.compensation} disabled={disabled} floatingLabelText='损坏赔偿' 
            style={styles.textField} onChange={this.commonTextFiledChange('compensation', true).bind(this)}/>
          <br />

          <Checkbox defaultChecked={tenant.isOweRental} label="欠租金" disabled={true}
            style={styles.checkbox}/>
          <CommonTextField value={tenant.oweRental} disabled={true} floatingLabelText='欠租金' forceUpdate={forceUpdate}
            style={tenant.isOweRental? styles.textField: _.assign({}, styles.textField, {display: 'none'})} 
            onChange={this.commonTextFiledChange('oweRental', true).bind(this)}/>
          <DatePicker value={tenant.oweRentalExpiredDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='租金补齐期限' autoOk={true}
            style={tenant.isOweRental? styles.dataPicker: _.assign({}, styles.dataPicker, {display: 'none'})} 
            wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('oweRentalExpiredDate').bind(this)}/>
          <br />


          <CommonTextField defaultValue={tenant.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.fullWidth} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '410px'}}>
          <div style={{height: '325px'}}>
          电费：{tenant.electricCharges}<br />
          水费：{tenant.waterCharges}<br />
          退押金：{-tenant.deposit}<br />
          { tenant.isOweRental && (
              <span>欠租金：{tenant.oweRental}<br /></span>
          )}
          { Number(tenant.doorCardRecoverCount)>0 && (
              <span>退门卡：{-tenant.doorCardRecoverCharges}<br /></span>
          )}
          { Number(tenant.overdueDays)>0 && (
              <span>逾期罚款：{tenant.overdueCharges}<br /></span>
          )}
          { Number(tenant.compensation)>0 && (
              <span>损坏赔偿：{tenant.compensation}<br /></span>
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
    styles.textFieldLong = _.assign({}, styles.marginRight, {width: '180px', overflow: 'hidden',})
    styles.dataPicker = _.assign({}, styles.textField, {display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden'})
    styles.checkbox = _.assign({}, styles.marginRight, {width: '130px', display: 'inline-block', whiteSpace: 'nowrap', fontSize: '15px', top: '30px', minHeight: '72px'})
    return styles
  }
}

export default HousesCheckOut;





