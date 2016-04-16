'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';


import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox, IconButton, Dialog } from 'material-ui/lib'


import CommonTextField from '../common/common_text_field'
import CommonSelectField from '../common/common_select_field'
import CommonRaisedButton from '../common/common_raised_button'
import CommonIconButton from '../common/common_icon_button'
import CommonConfirmDialog from '../common/common_confirm_dialog'



class MansionsHouseLayouts extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    }
    this.bedroom = []
    this.livingroom = []
    this.brightness = []

    this.deleteIdx = -1

  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillMount() {
    this.stateHouseLayoutPatterns(this.props.houseLayoutPatterns)
  }

  componentWillReceiveProps(nextProps) {
    this.stateHouseLayoutPatterns(nextProps.houseLayoutPatterns)
  }

  stateHouseLayoutPatterns(houseLayoutPatterns) {
    var houseLayoutPattern = {}
    for (var i in houseLayoutPatterns) {
      houseLayoutPattern = houseLayoutPatterns[i]
      this[houseLayoutPattern.code] = houseLayoutPattern
    }
  }

  commonValueChange(idx, key, isNumber) {
    return function (value) {
      var houseLayouts = this.props.houseLayouts
      if (isNumber && !utils.isPositiveNumber(value)) {
      } else {
        houseLayouts[idx][key] = value
        this.props.updateParentState({houseLayouts})
      }
    }
  }

  onDelete(idx) {
    return function(e) {
      this.deleteIdx = idx
      this.setState({
        confirmDialogTitle : '确定删除 '+this.props.houseLayouts[idx].description,
        confirmDialogShow : true,
        confirmDialogOKClick : this.onDeleteConfirm.bind(this)
      })
    }
  }
  onDeleteConfirm() {
    if (this.deleteIdx>-1 && this.deleteIdx<this.props.houseLayouts.length) {
      this.props.onDeleteHouseLayout(this.deleteIdx)
    }
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  saveHouseLayouts() {
    this.setState({
      confirmDialogTitle : '确定保存户型信息',
      confirmDialogShow : true,
      confirmDialogOKClick : this.saveHouseLayoutsConfirm.bind(this)
    })
  }
  saveHouseLayoutsConfirm() {
    if (this.props.saveHouseLayouts) {
      this.props.saveHouseLayouts()
    }
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  confirmDialogOK() {
    this.state.confirmDialogOKClick.bind(this)()
  }
  confirmDialogCancel() {
    this.deleteIdx = -1
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  render() {
    let styles = this.getStyles()
    let houseLayouts = this.props.houseLayouts || []
    return (
      <div style={styles.tab}>
        <div style={{marginBottom: '20px', textAlign: 'right'}}>
          <CommonRaisedButton label="增加户型" primary={true} style={styles.marginRight} onTouchTap={this.props.onAddHouseLayout}/>
          <CommonRaisedButton label="保存户型信息" secondary={true} style={styles.marginRight} onTouchTap={this.saveHouseLayouts.bind(this)}/>
        </div>
        <table className='table'>
          <thead className='thead'>
            <tr className='tr'>
              <th style={{width: '12%'}} className='th'>户型名</th>
              <th className='th'>属性</th>
              <th style={{width: '9%'}} className='th'>默认押金</th>
              <th style={{width: '9%'}} className='th'>默认租金</th>
              <th style={{width: '9%'}} className='th'>默认定金</th>
              <th style={{width: '9%'}} className='th'>物业费/月</th>
              <th style={{width: '9%'}} className='th'>逾期罚款/天</th>
              <th style={{width: '10%'}} className='th'>操作</th>
            </tr>
          </thead>
          <tbody className='tbody'>
          {houseLayouts.map((houseLayout, idx) => (
            <tr className={idx%2===0? 'tr odd': 'tr even'} key={'houseLayout:'+idx}>
              <td className='td'> 
                <CommonTextField value={houseLayout.description} onChange={this.commonValueChange(idx, 'description').bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonSelectField value={houseLayout.bedroom} onChange={this.commonValueChange(idx, 'bedroom').bind(this)}
                  floatingLabelText='房间数' items={this.bedroom.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
                <CommonSelectField value={houseLayout.livingroom} onChange={this.commonValueChange(idx, 'livingroom').bind(this)}
                  floatingLabelText='客厅数' items={this.livingroom.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
                <CommonSelectField value={houseLayout.brightness} onChange={this.commonValueChange(idx, 'brightness').bind(this)}
                  floatingLabelText='光线' items={this.brightness.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
              </td>
              <td className='td'> 
                <CommonTextField value={houseLayout.defaultDeposit} onChange={this.commonValueChange(idx, 'defaultDeposit', true).bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonTextField value={houseLayout.defaultRental} onChange={this.commonValueChange(idx, 'defaultRental', true).bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonTextField value={houseLayout.defaultSubscription} onChange={this.commonValueChange(idx, 'defaultSubscription', true).bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonTextField value={houseLayout.servicesCharges} onChange={this.commonValueChange(idx, 'servicesCharges', true).bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonTextField value={houseLayout.overdueFine} onChange={this.commonValueChange(idx, 'overdueFine', true).bind(this)} style={styles.tableCellTextField}/>
              </td>
              <td className='td'> 
                <CommonIconButton keyString={houseLayout._id} iconStyle={{color: 'red'}} onTouchTap={this.onDelete(idx).bind(this)}>
                  <FontIcon className="material-icons">delete</FontIcon>
                </CommonIconButton>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <CommonConfirmDialog title={this.state.confirmDialogTitle} open={this.state.confirmDialogShow}
          ok={this.confirmDialogOK.bind(this)} cancel={this.confirmDialogCancel.bind(this)}/>
      </div>
    )
  }

// <Dialog modal={true} >
//             <div style={{width: '100%', textAlign: 'center', marginTop: '30px'}}>
//               <RaisedButton label="确定" primary={true} 
//                 style={styles.marginRight} onTouchTap=/>
//               <RaisedButton label="取消" primary={true} 
//                 style={styles.marginRight} onTouchTap=/>
//             </div>
//         </Dialog>
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
        padding: '30px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
      marginRight: {
        marginRight: '20px',
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
        width: '30%',
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
export default MansionsHouseLayouts;

