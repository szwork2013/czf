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


class HousesPayRent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      okDisable: false,
      printDisabled: true,

      house: {},
      // tenant: {},
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
    if (house.tenantId) {
      disabled = props.disabled!==undefined? props.disabled: false
      if (_.isEmpty(stateHouse)) {
        stateHouse = _.cloneDeep(house)
        tenant = stateHouse.tenantId
        if (tenant.oweRental) {
          //还欠上次租金的不允许交租，需要先补齐所欠租金
          disabled = true
          tenant.isOweRental = true
          tenant.oweRentalExpiredDate = new Date(tenant.oweRentalExpiredDate)
          this.setState({okDisable: true, printDisabled: true})
        } else {
          var oldTenant = house.tenantId
          delete tenant._id
          tenant.subscription = 0
          delete tenant.subscriberId
          tenant.rentalStartDate = new moment(new Date(oldTenant.rentalEndDate)).add(1, 'day').toDate()
          tenant.rentalEndDate = new moment(new Date(oldTenant.rentalEndDate)).add(1, 'M').toDate()
          tenant.contractStartDate = new Date(tenant.contractStartDate)
          tenant.contractEndDate = new Date(tenant.contractEndDate)
          tenant.electricMeterEndNumber
          tenant.waterMeterEndNumber
          tenant.waterTons = 0
          tenant.electricKWhs = 0
          tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh
          tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
          tenant.isOweRental = false
          tenant.oweRental = 0
          tenant.oweRentalExpiredDate = new moment().add(7, 'day').toDate()
          tenant.isChangeDeposit = false
          if (houseLayout) {
            tenant.servicesCharges = houseLayout.servicesCharges
          }
          this.setState({okDisable: false, printDisabled: true})
        }
        this.calcAll(tenant)
      } else {
        if (new Date(house.lastUpdatedAt).getTime() !== new Date(stateHouse.lastUpdatedAt).getTime()) {
          //说明是保存过本次的交租信息，不能再修改信息
          disabled = true
          this.setState({okDisable: true, printDisabled: false})
        }
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
    tenant.summed = Number(tenant.rental) + Number(tenant.servicesCharges) + Number(tenant.electricCharges) + Number(tenant.waterCharges)
    if (tenant.isChangeDeposit) {
      var changeDeposit = Number(tenant.deposit) - Number(oldTenant.deposit)
      tenant.summed += changeDeposit
      this.setState({changeDeposit})
    } else {
      this.setState({changeDeposit: 0})
    }
    tenant.summed = Number(tenant.summed.toFixed(1))

    this.setState({house, forceUpdate: true})
  }
  print() {

  }

  ok() {
    var openToast = this.props.openToast || function() {}
    var house = this.state.house || {}
    var tenant = house.tenantId || {}

    if (!tenant.mobile) return openToast({msg: '手机号不能为空'})
    if (!utils.isMobileNumber(tenant.mobile)) return openToast({msg: '手机号格式错误'})
    if (tenant.idNo && !IDCard.IDIsValid(tenant.idNo)) return openToast({msg: '身份证格式错误'})

    if (!utils.parseDate(tenant.contractStartDate)) return openToast({msg: '请选择合同开始日期'})
    if (!utils.parseDate(tenant.contractEndDate)) return openToast({msg: '请选择合同结束日期'})
    if (!utils.parseDate(tenant.rentalStartDate)) return openToast({msg: '请选择本次交租日期'})
    if (!utils.parseDate(tenant.rentalEndDate)) return openToast({msg: '请选择下次交租日期'})

    if (tenant.rental==='' || tenant.rental===undefined) return openToast({msg: '请输入租金'})
    if (tenant.servicesCharges==='' || tenant.servicesCharges===undefined) return openToast({msg: '请输入管理费'})

    if (tenant.electricMeterEndNumber==='' || tenant.electricMeterEndNumber===undefined) return openToast({msg: '请输入电表读数'})
    if (tenant.waterMeterEndNumber==='' || tenant.waterMeterEndNumber===undefined) return openToast({msg: '请输入水表读数'})

    if (tenant.isOweRental) {
      if (tenant.oweRental==='' || tenant.oweRental===undefined) return openToast({msg: '请输入欠租金'})
      if (!utils.parseDate(tenant.oweRentalExpiredDate)) return openToast({msg: '请选择租金补齐日期'})
    } 

    if (tenant.isChangeDeposit && (tenant.deposit==='' || tenant.deposit===undefined)) return openToast({msg: '请输入押金'})


    tenant.rental = Number(tenant.rental)
    tenant.servicesCharges = Number(tenant.servicesCharges)
    tenant.electricMeterEndNumber = Number(tenant.electricMeterEndNumber)
    tenant.waterMeterEndNumber = Number(tenant.waterMeterEndNumber)
    if (tenant.isChangeDeposit) tenant.deposit = Number(tenant.deposit)
    if (tenant.isOweRental) tenant.oweRental = Number(tenant.oweRental)
    this.setState({house, forceUpdate: true})
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
      <Dialog title={'交租登记：'+(tenant.floor+1)+'楼'+(tenant.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}}>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={tenant.name} disabled={true} floatingLabelText='姓名'
            style={styles.textField} onChange={this.commonTextFiledChange('name').bind(this)} ref='name'/>
          <CommonTextField value={tenant.mobile} disabled={true} floatingLabelText='手机号'
            style={styles.textField} onChange={this.commonTextFiledChange('mobile').bind(this)}/>
          <CommonTextField value={tenant.idNo} disabled={true} floatingLabelText='身份证'
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('idNo').bind(this)}/>
          <br />
          
          <DatePicker value={tenant.contractStartDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractStartDate').bind(this)}/>
          <DatePicker value={tenant.contractEndDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('contractEndDate').bind(this)}/>
          <DatePicker value={new Date(oldTenant.rentalEndDate)} disabled={true} formatDate={this.formatDate}
            floatingLabelText='上次交租期限' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <br />

          <CommonTextField value={tenant.rental} disabled={disabled} floatingLabelText='租金' 
            style={styles.textField} onChange={this.commonTextFiledChange('rental', true).bind(this)}/>
          <CommonTextField value={tenant.servicesCharges} disabled={disabled} floatingLabelText='管理费'
            style={styles.textField} onChange={this.commonTextFiledChange('servicesCharges', true).bind(this)}/>
          <DatePicker value={tenant.rentalEndDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='下次交租日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('rentalEndDate').bind(this)}/>
          <br />

          <CommonTextField value={tenant.electricMeterEndNumber} disabled={disabled} 
            floatingLabelText={'电表底数:'+house.electricMeterEndNumber}
            style={styles.textField} onChange={this.commonTextFiledChange('electricMeterEndNumber', true).bind(this)}/>
          <CommonTextField value={tenant.waterMeterEndNumber} disabled={disabled} 
            floatingLabelText={'水表底数:'+house.waterMeterEndNumber} 
            style={styles.textField} onChange={this.commonTextFiledChange('waterMeterEndNumber', true).bind(this)}/>
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
            onChange={this.datePickerChange('oweRentalExpiredDate').bind(this)}/>
          <br />

          <Checkbox defaultChecked={tenant.isChangeDeposit} label="修改押金" disabled={disabled}
            style={styles.checkbox} onCheck={this.checkboxChange('isChangeDeposit').bind(this)} />
          <CommonTextField value={tenant.isChangeDeposit? tenant.deposit: oldTenant.deposit} 
            disabled={disabled || !tenant.isChangeDeposit} 
            floatingLabelText={tenant.isChangeDeposit? '已收押金:'+oldTenant.deposit+'元': '押金'}
            hintText={tenant.isChangeDeposit? '已收押金：'+oldTenant.deposit+'元': '押金'} 
            style={styles.textField} onChange={this.commonTextFiledChange('deposit', true).bind(this)}/>
          <br />

          <CommonTextField defaultValue={tenant.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.fullWidth} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '485px'}}>
          <div style={{height: '400px'}}>
          租金：{tenant.rental}<br />
          电费：{tenant.electricCharges}<br />
          水费：{tenant.waterCharges}<br />
          管理费：{tenant.servicesCharges}<br />
          { tenant.isChangeDeposit && (
              <span>修改押金：{changeDeposit.toFixed(1)}<br /></span>
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

export default HousesPayRent;





