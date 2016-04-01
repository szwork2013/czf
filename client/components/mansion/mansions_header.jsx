'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';


import { RaisedButton, SelectField, TextField, MenuItem, Checkbox, Dialog, Divider } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'


import CommonSelectField from '../../components/common/common_select_field'
import CommonTextField from '../common/common_text_field'
import CommonRaisedButton from '../common/common_raised_button'
import CommonPromptDialog from '../common/common_prompt_dialog'

class MansionsHeader extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansionDialogShow: false,
      mansionName: '',
      mansionDialogTitle: '',
      mansionDialogOKClick: this.mansionDialogCancel
    }
  }



  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  deleteMansionDialogClick() {
    this.setState({mansionDialogShow: true, mansionDialogTitle: '确认删除：'+this.props.mansion.name, 
      mansionName: '', mansionDialogOKClick: this.deleteMansionDialogOK})
  }
  deleteMansionDialogOK(mansionName) {
    // var mansionName = this.refs['mansionName'].getValue()
    if (mansionName !== this.props.mansion.name) {
      this.props.actions.openToast({msg: '确认物业单位名称错误'})
      return false;
    } else {
      this.mansionDialogCancel()
      let param = {mansionId: this.props.mansion._id}
      this.props.actions.deleteMansionClick(param)
    }
  }

  newMansionDialogClick() {
    this.setState({mansionDialogShow: true, mansionDialogTitle: '新建物业', mansionName: '', mansionDialogOKClick: this.newMansionDialogOK})
  }
  newMansionDialogOK(mansionName) {
    // var mansionName = this.refs['mansionName'].getValue()
    if (_.isEmpty(mansionName)) {
      this.props.actions.openToast({msg: '物业单位名称不能为空'})
      return false;
    } else {
      this.mansionDialogCancel()
      let param = {name: mansionName}
      this.props.actions.addMansionClick(param)
    }
  }

  mansionDialogOK(value) {
    this.state.mansionDialogOKClick.bind(this)(value)
  }
  mansionDialogCancel() {
    this.setState({mansionDialogShow: false, mansionDialogTitle: '', mansionName: '', mansionDialogOKClick: this.mansionDialogCancel})
  }
  commonTextFiledChange(key) {
    return function (value) {
      log.error(value)
      if(this.refs[key] && this.refs[key].getValue)
        return this.setState({[key]: this.refs[key].getValue()})
      return this.setState({[key]: value})
      
    }
  }

  importOldVersionData(e) {
    var fileInput = this.refs["old_version_file_input"] || {}
    var files = fileInput.files || {}
    var file = files[0]
    var param = {mansionId: this.props.mansion._id, file: file}
    this.props.actions.importHistoryVersionDataClick(param)
    fileInput.value = null;
  }


  render() {
    var styles = this.getStyles()
    var props = this.props
    var mansion = props.mansion;
    return (
        <div style={{marginBottom: '20px'}} className='container-fluid'>
            <CommonSelectField value={mansion._id} onChange={props.handleMansionsChange} style={styles.marginRight}
              floatingLabelText='物业单位' forceUpdate={props.forceUpdate}
              items={props.ownMansions} itemValue='_id' itemPrimaryText='name' itemKey='_id' fullWidth={false}/>
            <CommonRaisedButton label="导入旧数据" labelPosition="before" style={styles.marginRight} primary={true}>
              <input type="file" style={styles.fileInput} ref="old_version_file_input" accept=".rdt,"
                  onChange={this.importOldVersionData.bind(this)}/>
            </CommonRaisedButton>
            <CommonRaisedButton label="删除物业单位" labelPosition="before" primary={true} 
              style={styles.marginRight} onTouchTap={this.deleteMansionDialogClick.bind(this)}/>
            <CommonRaisedButton label="新建物业单位" labelPosition="before" primary={true} 
              style={styles.marginRight} onTouchTap={this.newMansionDialogClick.bind(this)}/>

            <CommonPromptDialog title={this.state.mansionDialogTitle} open={this.state.mansionDialogShow} 
              hintText="请输入物业单位名称"
              ok={this.mansionDialogOK.bind(this)} cancel={this.mansionDialogCancel.bind(this)} />
        </div>
    )
  }

          // <Dialog title={this.state.mansionDialogTitle} modal={true} open={this.state.mansionDialogShow}>
          //   <TextField hintText="请输入物业单位名称" floatingLabelText="请输入物业单位名称" 
          //     fullWidth={true} ref='mansionName'/>
          //   <div style={{width: '100%', textAlign: 'right', marginTop: '30px'}}>
          //     <RaisedButton label="确定" labelPosition="before" primary={true} 
          //       style={styles.marginRight} onTouchTap={this.state.mansionDialogOKClick.bind(this)}/>
          //     <RaisedButton label="取消" labelPosition="before" primary={true} 
          //       style={styles.marginRight} onTouchTap={this.mansionDialogCancel.bind(this)}/>
          //   </div>
          // </Dialog>

  getStyles() {
    // const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      marginRight: {
        marginRight: '20px',
      },
      divider: {
        width: '20px',
        display: 'inline-block',
      },
      fileInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      },
    }
    return styles;
  }
}
export default MansionsHeader;
