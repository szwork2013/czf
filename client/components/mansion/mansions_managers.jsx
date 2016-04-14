'use strict';
import log from '../../utils/log'
import _ from 'lodash'
import utils from '../../utils'


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
import CommonPromptDialog from '../common/common_prompt_dialog'
import CommonRadioButtonGroup from '../common/common_radio_button_group'



class MansionsManagers extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      forceUpdate: true,  //注要用于楼层数发生改变时更新。

      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {},

      promptDialogTitle: '',
      promptDialogShow: false,
      promptDialogHintText: '',
      promptDialogOK: () => {}
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.forceUpdate) {
      this.setState({forceUpdate: false})
    }
  }


  commonValueChange(idx, key, isNumber) {
    return function (value) {
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      } 
      let managersInfo = this.props.managersInfo
      managersInfo[idx][key] = value
      this.props.updateParentState({managersInfo})
    }
  }


  onShowFloorChange(e, value) {
    this.setState({showFloor: value})
  }

  onAddManager() {
    this.setState({
      promptDialogTitle: '请输入需添加管理者的手机号或邮箱',
      promptDialogShow: true,
      promptDialogHintText: '手机号/邮箱',
      promptDialogOK: this.onAddManagerOK.bind(this)
    })
  }
  onAddManagerOK(value) {
    if(this.props.onAddManager) {
      this.props.onAddManager(value)
    }
  }

  /*
   * 删除管理员
   */
  onDeleteManager(managerId) {
    return function(e) {
      this.setState({
        confirmDialogTitle : '确定删除：'+this.props.managersInfo[managerId].user.firstName,
        confirmDialogShow : true,
        confirmDialogOKClick : this.onDeleteManagerConfirm(managerId).bind(this)
      })
    }
  }
  onDeleteManagerConfirm(managerId) {
    return function(e) {
      if (this.props.onDeleteManager) {
        this.props.onDeleteManager(managerId)
      }
      this.setState({
        confirmDialogTitle : '',
        confirmDialogShow : false,
        confirmDialogOKClick : () => {}
      })
    }
  }

  saveManagersInfo() {
    this.setState({
      confirmDialogTitle : '确定保存管理员',
      confirmDialogShow : true,
      confirmDialogOKClick : this.saveManagersInfoConfirm.bind(this)
    })
  }

  saveManagersInfoConfirm() {
    if (this.props.saveManagersInfo) {
      this.props.saveManagersInfo()
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
    this.setState({
      confirmDialogTitle : '',
      confirmDialogShow : false,
      confirmDialogOKClick : () => {}
    })
  }

  promptDialogOK(value) {
    this.state.promptDialogOK.bind(this)(value)
    this.setState({
      promptDialogTitle: '',
      promptDialogShow: false,
      promptDialogHintText: '',
      promptDialogOK: () => {}
    })
  }
  promptDialogCancel() {
    this.setState({
      promptDialogTitle: '',
      promptDialogShow: false,
      promptDialogHintText: '',
      promptDialogOK: () => {}
    })
  }

  render() {
    var styles = this.getStyles()
    var state = this.state || {}
    var managersInfo = this.props.managersInfo || {}
    return (
      <div style={styles.tab}>
        <div style={{marginBottom: '20px', textAlign: 'right'}}>
          <CommonRaisedButton label="添加管理员" primary={true} style={styles.marginRight} onTouchTap={this.onAddManager.bind(this)}/>
          <CommonRaisedButton label="保存管理员" secondary={true} style={styles.marginRight} onTouchTap={this.saveManagersInfo.bind(this)}/>
        </div>
        <table className='table'>
          <thead className='thead'>
            <tr className='tr'>
              <th style={{width: '6%'}} className='th'>索引</th>
              <th style={{width: '10%'}} className='th'>姓名</th>
              <th style={{width: '6%'}} className='th'>性别</th>
              <th style={{width: '15%'}} className='th'>手机号</th>
              <th style={{width: '18%'}} className='th'>邮箱</th>
              <th style={{width: '12%'}} className='th'>添加日期</th>
              <th className='th'>备注</th>
              <th style={{width: '10%'}} className='th'>操作</th>
            </tr>
          </thead>
          <tbody className='tbody'>
          {_.values(managersInfo).map((manager, idx) => {
            var user = manager.user || {}
            return (
              <tr className={idx%2===0? 'tr odd': 'tr even'} key={'managers:'+idx}>
                <td className='td'> 
                  {idx+1}  
                </td>
                <td className='td'> 
                  {user.firstName || ''}
                </td>
                <td className='td'> 
                  {utils.decodeGender(user.gender)}
                </td>
                <td className='td'> 
                  {user.mobile}
                </td>
                <td className='td'> 
                  {user.email}
                </td>
                <td className='td'> 
                  {manager.createdAt? new moment(manager.createdAt).format('YYYY/MM/DD'): ''}
                </td>
                <td className='td'> 
                  <CommonTextField value={manager.remark} onChange={this.commonValueChange(user._id, 'remark').bind(this)} style={styles.tableCellTextField}/>
                </td>
                <td className='td'> 
                  <CommonIconButton keyString={user._id} iconStyle={{color: 'red'}} onTouchTap={this.onDeleteManager(user._id).bind(this)}>
                    <FontIcon className="material-icons">delete</FontIcon>
                  </CommonIconButton>
                </td>
              </tr>
            )}
          )}
          </tbody>
        </table>
        <CommonConfirmDialog title={state.confirmDialogTitle} open={state.confirmDialogShow}
          ok={this.confirmDialogOK.bind(this)} cancel={this.confirmDialogCancel.bind(this)}/>
        <CommonPromptDialog title={state.promptDialogTitle} open={state.promptDialogShow} hintText={state.promptDialogHintText}
          ok={this.promptDialogOK.bind(this)} cancel={this.promptDialogCancel.bind(this)} />
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
export default MansionsManagers;

