'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'
import IDCard from '../../../utils/identitycard'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';
import moment from 'moment'

import { Dialog, RaisedButton, Divider, TextField, DatePicker, Checkbox, RadioButton } from 'material-ui/lib'
import CommonTextField from '../common/common_text_field'
import CommonRadioButtonGroup from '../common/common_radio_button_group'


class HousesDoorCard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      calcDisable: false,
      okDisable: true,
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
    var doorCard = stateHouse.doorCard || {}
    if (!_.isEmpty(house)) {
      if (_.isEmpty(doorCard)) {
        stateHouse = _.cloneDeep(house)
        doorCard = _.pick(stateHouse, ['mansionId', 'floor', 'room'])
        if (stateHouse.tenantId) {
          _.assign(doorCard, _.pick(stateHouse.tenantId, ['name', 'mobile', 'idNo']))
        }
        stateHouse.doorCard = doorCard
        doorCard.sellOrRecover = 'sell'
        doorCard.doorCardSellCharges = mansion.doorCardSellCharges
        doorCard.doorCardRecoverCharges = mansion.doorCardRecoverCharges
        this.setState({calcDisable: false, okDisable: true, printDisabled: true})
        this.calcAll(stateHouse)
      }
      if (house.charge) {
        var charge = house.charge
        if (charge.type==='doorcard' && charge.summed===doorCard.summed) {
          disabled = true
          this.setState({calcDisable: true, okDisable: true, printDisabled: false})
        } else {
          disabled = false
          this.setState({calcDisable: false, okDisable: false, printDisabled: true})
        }
      } else {
        disabled = false
        this.setState({calcDisable: false, okDisable: false, printDisabled: true})
      }
    } else {
      stateHouse = {}
      disabled = true
      this.setState({calcDisable: true, okDisable: true, printDisabled: true})
    }
    this.setState({house: stateHouse, houseLayout, disabled})
  }

  /*
   * 计算总费
   */
  calcAll(house) {
    var mansion = this.props.mansion
    var house = house || this.state.house
    var doorCard = house.doorCard || {}
    if (doorCard.sellOrRecover === 'sell') 
      doorCard.summed = Number(doorCard.doorCardCount) * doorCard.doorCardSellCharges
    else if (doorCard.sellOrRecover === 'recover') 
      doorCard.summed = -Number(doorCard.doorCardCount) * doorCard.doorCardRecoverCharges
    this.setState({house, okDisable: true, forceUpdate: true})
  }

  /*
   * 输入框变化处理
   */ 
  commonTextFiledChange(key, isNumber) {
    return function (value) {
      var house = this.state.house || {}
      var doorCard = house.doorCard || {}
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        doorCard[key] = value
        this.setState({house, okDisable: true, forceUpdate: true})
        this.calcAll()
      }
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

  calc() {
    this.setState({okDisable: false, forceUpdate: true})
  }
  ok() {
    var openToast = this.props.openToast || function() {}
    var house = this.state.house || {}
    var doorCard = house.doorCard || {}

    if (doorCard.doorCardCount==='' || doorCard.doorCardCount===undefined) return openToast({msg: '请输入门卡数'})

    doorCard.doorCardCount = Number(doorCard.doorCardCount)
    if (isNaN(doorCard.doorCardCount)) doorCard.doorCardCount = ''

    this.setState({house, forceUpdate: true})

    if (isNaN(doorCard.summed)) {
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
    var doorCard = stateHouse.doorCard || {}

    var disabled = state.disabled
    var wordings = {ok: '确定', cancel: '取消'}
    var forceUpdate = state.forceUpdate

    return (
      <Dialog title={'门卡购退登记：'+(stateHouse.floor+1)+'楼'+(stateHouse.room+1)+'房'+'  [  '+houseLayout.description+'  ]'} modal={true} 
        open={this.props.open} autoDetectWindowHeight={false} 
        contentStyle={{transform: 'translate3d(0px, 0px, 0px)'}} 
        titleStyle={{borderBottom: '2px solid #e0e0e0', padding: '10px 24px 5px 24px'}} 
        bodyStyle={{overflowY: 'auto', maxHeight: 'calc(100vh - 110px)', padding: '5px 24px 24px 24px'}} className='noprint'>
        <div style={{display: 'inline-block', float: 'left', width: '500px'}}>
          
          <CommonTextField defaultValue={doorCard.name} disabled={true} floatingLabelText='姓名' 
            style={styles.textField} onChange={this.commonTextFiledChange('name').bind(this)} ref='name'/>
          <CommonTextField value={doorCard.mobile} disabled={true} floatingLabelText='手机号' 
            style={styles.textField} onChange={this.commonTextFiledChange('mobile').bind(this)}/>
          <CommonTextField value={doorCard.idNo} disabled={true} floatingLabelText='身份证' 
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('idNo').bind(this)}/>
          <br />
          
          <CommonRadioButtonGroup name='showHouse' valueSelected={doorCard.sellOrRecover} style={styles.raidioButtonGroup}
            onChange={this.commonTextFiledChange('sellOrRecover').bind(this)} forceUpdate={forceUpdate}>
            <RadioButton value='sell' label='购门卡' style={styles.raidoButton} disabled={disabled}/>
            <RadioButton value='recover' label='退门卡' style={styles.raidoButton} disabled={disabled}/>
          </CommonRadioButtonGroup>

          <CommonTextField value={doorCard.doorCardCount} disabled={disabled} floatingLabelText='门卡数'
            style={styles.textFieldLong} onChange={this.commonTextFiledChange('doorCardCount', true).bind(this)}/>
          <br />

          <CommonTextField defaultValue={doorCard.remark} disabled={disabled} floatingLabelText='备注'
            style={styles.fullWidth} onChange={this.commonTextFiledChange('remark').bind(this)} fullWidth={true} ref='remark'/>
        </div>

        <div style={{textAlign: 'left', marginTop: '10px', paddingTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', 
                     fontSize: '20px', display: 'inline-block', float: 'left', width: '200px', height: '185px'}}>
          <div style={{height: '57px'}}>
            门卡：{doorCard.summed}
          
          </div>
          <span style={{display: 'inline-block', minWidth: '150px', marginBottom: '10px', marginTop: '10px'}}>
            总计：<span style={{color: 'red'}}>{doorCard.summed}</span> 元
          </span>

          <RaisedButton label="计算总费" primary={true} style={{width: '195px', marginBottom: '8px'}} onTouchTap={this.calc.bind(this)} disabled={state.calcDisable}/>
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
      raidioButtonGroup: {  
        marginRight: '17px',
        display: 'inline-block',
        position: 'relative',
        top: '-15px',
      },
      raidoButton: {
        display: 'inline-block',
        fontSize: '15px',
        whiteSpace: 'nowrap',
        marginRight: '56px',
        width: 'auto'
      },
    }
    styles.textField = _.assign({}, styles.marginRight, {width: '130px', overflow: 'hidden',})
    styles.textFieldLong = _.assign({}, styles.marginRight, {width: '180px', overflow: 'hidden',})
    styles.dataPicker = _.assign({}, styles.textField, {display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden'})
    styles.checkbox = _.assign({}, styles.marginRight, {width: '130px', display: 'inline-block', whiteSpace: 'nowrap', fontSize: '15px', top: '30px', minHeight: '72px'})
    return styles
  }
}

export default HousesDoorCard;





