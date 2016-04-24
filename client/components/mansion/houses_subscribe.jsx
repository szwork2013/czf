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


class HousesSubscribe extends Component {
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
    var subscriber = stateHouse.subscriberId || {}
    if (!_.isEmpty(house)) {
      if (house.tenantId) {
        //如果出租，不许再编辑
        disabled = true
        this.setState({okDisable: true, printDisabled: true})
      } else if (house.subscriberId) {
        //如果已有订房，不许再编辑
        disabled = true
        this.setState({okDisable: true, printDisabled: false})
      } else {
        disabled = false
        this.setState({okDisable: false, printDisabled: true})
      }
      if (_.isEmpty(subscriber)) {
        stateHouse = _.cloneDeep(house)
        subscriber = _.pick(stateHouse, ['mansionId', 'floor', 'room'])
        stateHouse.subscriberId = subscriber
        subscriber.houseId = house._id
        subscriber.subscribeDate = new moment().startOf('day').toDate()
        subscriber.expiredDate = new moment().add(mansion.houseSubscriptionValidityCount, 'day').endOf('day').toDate()
        if (houseLayout) {
          subscriber.subscription = houseLayout.defaultSubscription
        }
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
   * 计算总费
   */
  calcAll(house) {
    var mansion = this.props.mansion
    var house = house || this.state.house
    var subscriber = house.subscriberId || {}
    subscriber.summed = Number(subscriber.subscription)
    this.setState({house, forceUpdate: true})
  }

  /*
   * 输入框变化处理
   */ 
  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var house = this.state.house || {}
      var subscriber = house.subscriberId || {}
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        subscriber[key] = value
        this.setState({house, forceUpdate: true})
        this.calcAll()
      }
    }
  }
  datePickerChange(key, startOrEnd='endOf') {
    return function(e, value) {
      var house = this.state.house || {}
      var subscriber = house.subscriberId || {}
      subscriber[key] = new moment(value)[startOrEnd]('day').toDate()
      this.setState({house, forceUpdate: true})
    }
  }

  formatDate(date) {
    return new moment(date).format('YYYY/MM/DD')
  }

  print() {
    if (this.props.print) {
      this.props.print()
    }
  }

  ok() {
    var openToast = this.props.openToast || function() {}
    var house = this.state.house || {}
    var subscriber = house.subscriberId || {}

    if (!subscriber.name) return openToast({msg: '姓名不能为空'})
    if (!subscriber.mobile) return openToast({msg: '手机号不能为空'})
    if (!utils.isMobileNumber(subscriber.mobile)) return openToast({msg: '手机号格式错误'})
    if (subscriber.idNo && !IDCard.IDIsValid(subscriber.idNo)) return openToast({msg: '身份证格式错误'})

    if (!utils.parseDate(subscriber.subscribeDate)) return openToast({msg: '请选择订房时间'})
    if (!utils.parseDate(subscriber.expiredDate)) return openToast({msg: '请选择定房失效日期'})

    if (subscriber.subscription==='' || subscriber.subscription===undefined) return openToast({msg: '请输入定金'})

    subscriber.subscription = Number(subscriber.subscription)
    if (isNaN(subscriber.subscription)) subscriber.subscription = ''

    this.setState({house, forceUpdate: true})

    if (isNaN(subscriber.summed)) {
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
    var stateHouse = state.house || {}
    var subscriber = stateHouse.subscriberId || {}
    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate

    return (
      <Dialog title={'定房登记：'+(stateHouse.floor+1)+'楼'+(stateHouse.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}} className='noprint'>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={subscriber.name} disabled={disabled} floatingLabelText='姓名' 
            style={styles.textField} onChange={this.commonTextFiledChange('name').bind(this)} ref='name'/>
          <CommonTextField value={subscriber.mobile} disabled={disabled} floatingLabelText='手机号' 
            style={styles.textField} onChange={this.commonTextFiledChange('mobile').bind(this)}/>
          <CommonTextField value={subscriber.idNo} disabled={disabled} floatingLabelText='身份证' 
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('idNo').bind(this)}/>
          <br />
          
          <DatePicker value={subscriber.subscribeDate} disabled={true} formatDate={this.formatDate}
            floatingLabelText='定房日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('subscribeDate').bind(this)}/>
          <DatePicker value={subscriber.expiredDate} disabled={disabled} formatDate={this.formatDate}
            floatingLabelText='定房失效日期' autoOk={true}
            style={styles.dataPicker} wordings={wordings} locale='zh-Hans' DateTimeFormat={Intl.DateTimeFormat}
            onChange={this.datePickerChange('expiredDate', 'endOf').bind(this)}/>
          <br />

          <CommonTextField value={subscriber.subscription} disabled={disabled} floatingLabelText='定金'
            style={styles.textField} onChange={this.commonTextFiledChange('subscription', true).bind(this)}/>
          <br />

          <CommonTextField defaultValue={subscriber.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.fullWidth} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '265px'}}>
          <div style={{height: '180px'}}>
          定金：{subscriber.subscription}<br />
          
          </div>
          <span style={{display: 'inline-block', minWidth: '150px', marginBottom: '10px', marginTop: '10px'}}>
            总计：<span style={{color: 'red'}}>{subscriber.summed}</span> 元
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

export default HousesSubscribe;





