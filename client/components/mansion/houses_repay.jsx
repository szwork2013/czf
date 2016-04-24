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


class HousesRepay extends Component {
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
    var house = props.house || {}
    var disabled = false
    var houseLayout = houseLayouts.find( houseLayout => { return houseLayout._id === house.houseLayout})
    var stateHouse = this.state.house || {}
    var tenant = stateHouse.tenantId || {}
    if (!_.isEmpty(house) && house.tenantId) {
      if (house.tenantId.oweRental) {
        //还欠上次租金
        disabled = false
        this.setState({okDisable: false, printDisabled: true})
      } else {
        disabled = true
        this.setState({okDisable: true, printDisabled: false})
      }
      if (_.isEmpty(tenant)) {
        stateHouse = _.cloneDeep(house)
        tenant = stateHouse.tenantId || {}
        tenant.rentalStartDate = new Date(tenant.rentalStartDate)
        tenant.rentalEndDate = new Date(tenant.rentalEndDate)
        tenant.contractStartDate = new Date(tenant.contractStartDate)
        tenant.contractEndDate = new Date(tenant.contractEndDate)
        tenant.oweRentalRepay = tenant.oweRental
        tenant.oweRentalExpiredDate = new Date(tenant.oweRentalExpiredDate)
        this.calcAll(stateHouse)
      }
    } else {
      stateHouse = {}
      disabled = true
      this.setState({okDisable: true, printDisabled: true})
    }
    this.setState({house: stateHouse, houseLayout, disabled})
  }

  /*
   * 计算总价
   */
  calcAll(house) {
    var mansion = this.props.mansion
    var house = house || this.state.house
    var tenant = house.tenantId
    tenant.summed = Number(tenant.oweRentalRepay)
    this.setState({house, forceUpdate: true})
  }

  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var stateHouse = this.state.house || {}
      var stateTenant = stateHouse.tenantId || {}
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        stateTenant[key] = value
        this.setState({house: stateHouse, forceUpdate: true})
        this.calcAll()
      }
    }
  }

  formatDate(date) {
    return new moment(date).format('YYYY/MM/DD')
  }
  print() {

  }

  ok() {
    var openToast = this.props.openToast || function() {}
    var propsHouse = this.props.house || {}
    var propsTenant = propsHouse.tenantId || {}
    var stateHouse = this.state.house || {}
    var stateTenant = stateHouse.tenantId || {}
    if (!propsTenant.oweRental) {
      return openToast({msg: '该出租房未欠租金'})
    }
    stateTenant.oweRental = Number(stateTenant.oweRental)
    stateTenant.oweRentalRepay = Number(stateTenant.oweRentalRepay)
    if (stateTenant.oweRentalRepay !== stateTenant.oweRentalRepay) return openToast({msg: '所欠租金需一次性补齐'})
    

    this.setState({stateHouse, forceUpdate: true})
  
    if (isNaN(stateTenant.summed)) {
      return openToast({msg: '非法数字，总计错误'})
    }

    if(this.props.ok) {
      this.props.ok(stateHouse)
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
    var propsHouse = props.house || {}
    var propsTenant = propsHouse.tenantId || {}
    var stateHouse = this.state.house || {}
    var stateTenant = stateHouse.tenantId || {}
    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate

    return (
      <Dialog title={'补交欠款：'+(stateTenant.floor+1)+'楼'+(stateTenant.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}}  className='noprint'>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={stateTenant.name} disabled={true} floatingLabelText='姓名'
            style={styles.textField} />
          <CommonTextField value={stateTenant.mobile} disabled={true} floatingLabelText='手机号' 
            style={styles.textField} />
          <CommonTextField value={stateTenant.idNo} disabled={true} floatingLabelText='身份证' 
            style={styles.textFieldLong} />
          <br />
          
          <DatePicker value={stateTenant.contractStartDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同开始日期' hintText='合同开始日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <DatePicker value={stateTenant.contractEndDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='合同结束日期' hintText='合同结束日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <DatePicker value={stateTenant.rentalEndDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='下次交租日期' hintText='下次交租日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <br />


          <CommonTextField value={stateTenant.oweRentalRepay} disabled={true} floatingLabelText={'所欠租金:'+stateTenant.oweRental} 
            forceUpdate={forceUpdate} style={styles.textField} />
          <DatePicker value={stateTenant.oweRentalExpiredDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='租金补齐期限' autoOk={true} style={styles.dataPicker} 
            wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}/>
          <br />

          <CommonTextField defaultValue={stateTenant.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.fullWidth} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '260px'}}>
          <div style={{height: '175px'}}>
          补交欠款：{stateTenant.oweRentalRepay}<br />
          
          </div>
          <span style={{display: 'inline-block', minWidth: '150px', marginBottom: '10px', marginTop: '10px'}}>
            总计：<span style={{color: 'red'}}>{stateTenant.summed}</span> 元
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

export default HousesRepay;





