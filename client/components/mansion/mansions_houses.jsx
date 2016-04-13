'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';


import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox, IconButton, Dialog, RadioButton } from 'material-ui/lib'


import CommonTextField from '../common/common_text_field'
import CommonSelectField from '../common/common_select_field'
import CommonRaisedButton from '../common/common_raised_button'
import CommonIconButton from '../common/common_icon_button'
import CommonConfirmDialog from '../common/common_confirm_dialog'
import CommonRadioButtonGroup from '../common/common_radio_button_group'



class MansionsHouse extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      floor: [],
      showFloor: '0',
      forceUpdate: true,  //注要用于楼层数发生改变时更新。

      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    };
    
    this.floorLength = 0
    // this.deleteIdx = -1
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillMount() {
    this.stateFloor(this.props.floor)
    this.stateHouseLayouts(this.props.houseLayouts)
  }

  componentWillReceiveProps(nextProps) {
    this.stateFloor(nextProps.floor)
    this.stateHouseLayouts(nextProps.houseLayouts)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
  }

  stateFloor(floor) {
    if (this.floorLength != floor.length) {
      this.floorLength = floor.length
      if (Number(this.state.showFloor) > floor.length-1) {
        this.state.showFloor = '0'
      }
      this.setState({floor, showFloor: this.state.showFloor, forceUpdate: true})
    } else {
      this.setState({floor, forceUpdate: false})
    }
  }

  stateHouseLayouts(houseLayouts) {
    var newHouseLayouts = houseLayouts.filter(houseLayout => {
      return houseLayout._id
    })
    this.setState({houseLayouts: newHouseLayouts})
  }

  commonValueChange(floorIdx, roomIdx, key, isNumber) {
    return function (value) {
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      } 
      var house = this.state.floor[floorIdx][roomIdx]
      house[key] = value
      this.props.updateParentState({floor: this.state.floor})
    }
  }

  onSaveFloor() {
    this.setState({
      confirmDialogTitle : '确定保存所有楼层出租房信息',
      confirmDialogShow : true,
      confirmDialogOKClick : this.onSaveFloorConfirm.bind(this)
    })
  }
  onSaveFloorConfirm() {
    if (this.props.onSaveFloor) {
      this.props.onSaveFloor()
    }
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }
  

  onShowFloorChange(value) {
    this.setState({showFloor: value})
  }

  /*
   * 删除楼层
   */
  onDeleteFloor() {
    this.setState({
      confirmDialogTitle : '确定删除 '+(Number(this.state.showFloor)+1)+' 楼全部出租房数据？',
      confirmDialogShow : true,
      confirmDialogOKClick : this.onDeleteFloorConfirm.bind(this)
    })
  }
  onDeleteFloorConfirm() {
    if (this.props.onDeleteFloor) {
      this.props.onDeleteFloor(Number(this.state.showFloor))
    }
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  /*
   * 删除房间
   */
  onDeleteHouse(floorIdx, roomIdx) {
    return function(e) {
      this.setState({
        confirmDialogTitle : '确定删除 '+(floorIdx+1)+' 楼 '+(roomIdx+1)+' 房？',
        confirmDialogShow : true,
        confirmDialogOKClick : this.onDeleteHouseConfirm(floorIdx, roomIdx).bind(this)
      })
    }
  }
  onDeleteHouseConfirm(floorIdx, roomIdx) {
    return function(e) {
      if (this.props.onDeleteHouse) {
        this.props.onDeleteHouse(floorIdx, roomIdx)
      }
      this.setState({
        confirmDialogTitle : '',
        confirmDialogShow : false,
        confirmDialogOKClick : () => {}
      })
    }
  }

  onAddHouse() {
    var onAddHouse = this.props.onAddHouse
    if (onAddHouse) {
      onAddHouse(Number(this.state.showFloor))
    }
  }

  onChangeHouseExist(floorIdx, roomIdx) {
    return function (e) {
      var onChangeHouseExist = this.props.onChangeHouseExist
      if (onChangeHouseExist) {
        onChangeHouseExist(floorIdx, roomIdx);
      }
      // var house = this.state.floor[floorIdx][roomIdx]
      // house.isExist = !house.isExist
      // this.props.updateParentState({floor: this.state.floor})
    } 
  }

  confirmDialogOK() {
    this.state.confirmDialogOKClick.bind(this)()
  }
  confirmDialogCancel() {
    // this.deleteIdx = -1
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  render() {
    var styles = this.getStyles()
    var floor = this.state.floor || []
    var houses = floor[Number(this.state.showFloor) || 0] || []
    var maxHouseIdx = houses.length-1
    return (
      <div style={styles.tab}>
        <div style={styles.floorTableDiv}>
          <CommonRadioButtonGroup name='showFloor' valueSelected={this.state.showFloor} style={styles.floorTableCellDiv}
            onChange={this.onShowFloorChange.bind(this)} forceUpdate={this.state.forceUpdate}>
            {floor.map((f, i)=> {
              return (
                <RadioButton value={String(i)} label={i+1+'楼'} style={styles.raidoButton} key={'floor:'+i}/>
              )
            })}
          </CommonRadioButtonGroup>
          <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
            <span style={{display: 'inline-block', width: '216px'}} />
            <CommonRaisedButton label="增加楼层" primary={true} style={styles.buttonTop} onTouchTap={this.props.onAddFloor}/>
            <CommonRaisedButton label="删除楼层" primary={true} style={styles.buttonTop} onTouchTap={this.onDeleteFloor.bind(this)}/>
            <CommonRaisedButton label="增加房间" primary={true} style={styles.buttonMiddle} onTouchTap={this.onAddHouse.bind(this)}/>
            <CommonRaisedButton label="保存所有楼层出租房信息" secondary={true} style={styles.buttonBotton} onTouchTap={this.onSaveFloor.bind(this)}/>
        
          </div>
        </div>
        <table className='table'>
          <thead className='thead'>
            <tr className='tr'>
              <th style={{width: '6%'}} className='th'>楼层</th>
              <th style={{width: '6%'}} className='th'>房间号</th>
              <th style={{width: '15%'}} className='th'>户型</th>
              <th style={{width: '10%'}} className='th'>电表底表</th>
              <th style={{width: '10%'}} className='th'>水表底表</th>
              <th style={{width: '8%'}} className='th'>已出租</th>
              <th className='th'>备注</th>
              <th style={{width: '12%'}} className='th'>操作</th>
            </tr>
          </thead>
          <tbody className='tbody'>
          {houses.map((house, idx) => {
            var keyString = (house.isExist+house.floor)+house.room
            var tr = house.isExist? (
              <tr className={idx%2===0? 'tr odd': 'tr even'} key={'houses:'+house+':'+idx}>
                <td className='td'> 
                  {house.floor+1}
                </td>
                <td className='td'> 
                  {house.room+1}
                </td>
                <td className='td'> 
                  <CommonSelectField value={house.houseLayout} onChange={this.commonValueChange(house.floor, house.room, 'houseLayout').bind(this)}
                    floatingLabelText='户型' items={this.state.houseLayouts} itemValue='_id' itemPrimaryText='description' style={styles.tableCellSelect}/>
                </td>
                <td className='td'> 
                  <CommonTextField value={house.electricMeterEndNumber} onChange={this.commonValueChange(house.floor, house.room, 'electricMeterEndNumber', true).bind(this)} style={styles.tableCellTextField}/>
                </td>
                <td className='td'> 
                  <CommonTextField value={house.waterMeterEndNumber} onChange={this.commonValueChange(house.floor, house.room, 'waterMeterEndNumber', true).bind(this)} style={styles.tableCellTextField}/>
                </td>
                <td className='td'> 
                  {house.tenantId? (
                    <CommonIconButton keyString={keyString} iconStyle={{color: '#0CC022'}}>
                      <FontIcon className="material-icons">perm_identity</FontIcon>
                    </CommonIconButton>
                  ): (
                    <CommonIconButton keyString={keyString} iconStyle={{color: '#E1E9E2'}}>
                      <FontIcon className="material-icons" >perm_identity</FontIcon>
                    </CommonIconButton>
                  )}
                </td>
                <td className='td'> 
                  <CommonTextField value={house.remark} onChange={this.commonValueChange(house.floor, house.room, 'remark').bind(this)} style={styles.tableCellTextField}/>
                </td>
                <td className='td'> 
                  <CommonIconButton keyString={keyString} iconStyle={{color: 'orange'}} onTouchTap={this.onChangeHouseExist(house.floor, house.room, 'isExist').bind(this)}>
                    <FontIcon className="material-icons">lightbulb_outline</FontIcon>
                  </CommonIconButton>
                  {
                    maxHouseIdx === idx? (
                      <CommonIconButton keyString={keyString} iconStyle={{color: 'red'}} onTouchTap={this.onDeleteHouse(house.floor, house.room).bind(this)}>
                        <FontIcon className="material-icons">delete</FontIcon>
                      </CommonIconButton>
                    ) : ''
                  }
                  
                </td>
              </tr>
              ) : (
              <tr className={idx%2===0? 'tr odd': 'tr even'} key={'houses:'+idx}>
                <td className='td'> 
                  {house.floor+1}
                </td>
                <td className='td'> 
                  {house.room+1}
                </td>
                <td className='td'>
                  <div style={{display: 'inline-block', minHeight: '75px'}} ></div>
                </td>
                <td className='td'>  </td>
                <td className='td'>  </td>
                <td className='td'>  </td>
                <td className='td'>  </td>
                <td className='td'>
                  <CommonIconButton keyString={keyString} iconStyle={{color: '#EBE7E0'}} onTouchTap={this.onChangeHouseExist(house.floor, house.room, 'isExist').bind(this)}>
                    <FontIcon className="material-icons">lightbulb_outline</FontIcon>
                  </CommonIconButton>
                  {
                    maxHouseIdx === idx? (
                      <CommonIconButton keyString={keyString} iconStyle={{color: 'red'}} onTouchTap={this.onDeleteHouse(house.floor, house.room).bind(this)}>
                        <FontIcon className="material-icons">delete</FontIcon>
                      </CommonIconButton>
                    ) : ''
                  }
                </td>
              </tr>
              )
            return tr;
            }
            )}
          </tbody>
        </table>
        <CommonConfirmDialog title={this.state.confirmDialogTitle} open={this.state.confirmDialogShow}
          ok={this.confirmDialogOK.bind(this)} cancel={this.confirmDialogCancel.bind(this)}/>
      </div>
    )
  }

  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    const backgroundColor = palette.primary1Color;
    const buttom1Color = palette.primary1Color;
    const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      tab: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '10px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
      raidoButton: {
        display: 'inline-block',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        marginRight: '40px',
        width: 'auto'
      },
      buttonTop: {
        margin: '0px 10px 10px 10px'
      },
      buttonMiddle: {
        margin: '10px 10px 10px 10px'
      },
      buttonBotton: {
        margin: '10px 10px 30px 10px',
      },
      button: {
        margin: '10px',
      },
      marginRight: {
        marginRight: '20px',
      },
      floorTableDiv: {
        display: 'table', 
        width: '100%',
        boxSizing: 'border-box'
      },
      floorTableCellDiv: {
        display: 'table-cell',
        verticalAlign: 'middle',
        width: '100%',
      },

      divider: {
        width: '20px',
        display: 'inline-block',
      },
      tableCellTextField: {
        minWidth: '80px',
        width: '100%',
        fontSize: '12px',
      },
      tableCellSelect: {
        minWidth: '80px',
        width: '100%',
        fontSize: '12px',
        marginRight: '10px',
      },
      tableIcon: {
        color: 'rbg(255, 0, 0)'
      }
    }
    return styles;
  }


}
export default MansionsHouse;

