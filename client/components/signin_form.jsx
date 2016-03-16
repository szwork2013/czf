'use strict';

import log from '../utils/log'

import React, { Component, PropTypes } from 'react';

import Colors from 'material-ui/lib/styles/colors';
import { Paper, Avatar, FontIcon, TextField, FlatButton, Checkbox, Divider, ClearFix } from 'material-ui/lib'

import utils from '../utils'

export default class SignInForm extends Component {
  constructor(props, context) {
    super(props, context);
    let user = props.user
    this.state = {
      signinType: props.signinType || 'password'
    };
  }

  /*
   *
   */
  checkParam(value, checkFunc, key) {
    if (!value) {
      if (key) this.props.openToast({status: 400, msg: `${key} is required`});
      return false;
    } else if(checkFunc && !checkFunc(value)) {
      if (key) this.props.openToast({status: 400, msg: `${key} format wrong`});
      return false;
    }
    return true;
  }

  /*
   * 获取验证码
   */
  getAuthCode(e) {
    e.preventDefault();
    let mobile = this.refs.mobile.getValue();
    if (this.checkParam(mobile, utils.isMobileNumber, 'mobile')) {
      this.props.authCodeClick({mobile})
    }
  }


  signinSubmit(e) {
    e.preventDefault();
    var formData = {}
    if (this.refs.mobile) {
      //用户名密码登陆
      let mobile = this.refs.mobile.getValue();
      let authCode = this.refs.authCode.getValue();
      if (this.checkParam(mobile, utils.isMobileNumber, 'mobile') && this.checkParam(authCode, utils.isAuthCode, 'authCode')) {
        formData = {mobile, code: authCode}
        this.props.signinAuthCodeSubmit(formData);
      } else {
        return;
      }
    } else if (this.refs.name) {
      //手机号登陆
      let name = this.refs.name.getValue();
      let password = this.refs.password.getValue();
      if ((this.checkParam(name, utils.isMobileNumber) || this.checkParam(name, utils.isEmail))){
        if (this.checkParam(password, null, 'password')) {
          formData = {name, password}
          this.props.signinNameSubmit(formData);
        } else {
          // this.props.openToast({status: 400, msg: `password is required`});
          return
        }
      } else {
        this.props.openToast({status: 400, msg: `name format wrong`});
        return;
      }
    }
  }

  /*
   * react 组件生命周期
   */
  componentWillReceiveProps(nextProps) {
    const { signinType } = nextProps;
    if (signinType) {
      this.setState({signinType: signinType})
    }
  }

  /*
   * render 相关函数
   */
  checkBoxChecked(isChecked, callback) {
    callback(!isChecked)
  }
  getUserMobile() {
    let user =  this.props.user;
    if (user && user.mobile)
      return user.mobile
    return ''
  }
  getUserSigninName() {
    let user =  this.props.user;
    if (user)
      if (user.mobile)
        return user.mobile
      else
        return user.email
    return ''
  }
  getSigninWithPasswordView(styles) {
    return (
      <div>
        <div style={styles.group}>
          <FontIcon className="material-icons" style={styles.icon}>face</FontIcon>
          <TextField hintText="手机号 / 邮箱" floatingLabelText="手机号 / 邮箱" ref='name' style={styles.input} defaultValue={this.getUserSigninName()}/>
        </div>
        <div style={styles.group}>
          <FontIcon className="material-icons" style={styles.icon}>lock_outline</FontIcon>
          <TextField hintText="密码" floatingLabelText="密码" ref='password' type='password' style={styles.input}/>
        </div>
      </div>
    )
  }
  getSigninWithVerifyCodeView(styles) {
    return (
      <div>
        <div style={styles.group}>
          <FontIcon className="material-icons" style={styles.icon}>local_phone</FontIcon>
          <TextField hintText="手机号" floatingLabelText="手机号" ref='mobile' style={styles.input} defaultValue={this.getUserMobile()}/>
        </div>
        <div style={styles.group}>
          <FontIcon className="material-icons" style={styles.icon}>textsms</FontIcon>
          <TextField hintText="验证码" floatingLabelText="验证码" ref='authCode' style={styles.verifyCodeInput}/>
          <FlatButton label={this.props.authCodeCounter || "获取验证码"} 
            disabled={this.props.authCodeCounter>0} 
            style={styles.verifyCodeBtn} onClick={this.getAuthCode.bind(this)}/>
        </div>
      </div>
    )
  }
  getSiginView(styles) {
    if (this.state.signinType === 'authCode')
      return this.getSigninWithVerifyCodeView(styles)
    else 
      return this.getSigninWithPasswordView(styles)
  }

  render() {
    const styles = this.getStyles();
    function defaultAvatar() {
      return (
        <FontIcon className="material-icons" style={styles.avatarIcon}>account_circle</FontIcon>
      );
    }
    return (
      <div>
        <div style={styles.background}></div>
        <div style={styles.tableContainer}>
          <div style={styles.cellContainer}>
            <Paper zDepth={3} style={styles.paper}>
              <div style={styles.photo}>
              {
                this.props.user && this.props.user.photo ?
                  <Avatar url={this.props.user.photo} size={150} style={styles.avatar}/> : 
                  <Avatar size={150} icon={defaultAvatar()} style={styles.avatar}/>
                // <img src={this.props.user &&  this.props.user.photo ? this.props.user.photo : ''} style={styles.image} />
              }
              </div>
              {
                this.getSiginView(styles)
              }

              <div style={styles.group}>
                <Checkbox label="记住用户名" defaultChecked={this.props.isRememberMe} style={styles.checkBox} iconStyle={styles.checkBoxIconStyle}
                  onCheck={(e) => this.checkBoxChecked(this.props.isRememberMe, this.props.rememberMe)} />
                <Checkbox label="自动登录" defaultChecked={this.props.isAutoSignin}  style={styles.checkBox} iconStyle={styles.checkBoxIconStyle}
                  onCheck={(e) => this.checkBoxChecked(this.props.isAutoSignin, this.props.autoSignin)} />
              </div>
              <div style={styles.group}>
                <FlatButton label="&nbsp;登录" style={styles.commitBtn} onClick={this.signinSubmit.bind(this)}/>
              </div>

              <div style={Object.assign({}, styles.group, {marginTop: '20px', textAlign: 'center'})}>
                {
                  this.state.signinType==='authCode' ?
                    <a style={styles.a} onClick={(e) => this.setState({'signinType': 'password'})} >密码登录</a>:
                    <a style={styles.a} onClick={(e) => this.setState({'signinType': 'authCode'})} >单次登录</a>
                }
                <span style={styles.aDivider}>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span> 
                <a style={styles.a}>&nbsp;&nbsp;注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册&nbsp;&nbsp;</a>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }


  //<i className="material-icons" style={{margin: '0px', fontSize: '150px', backgroundColor: this.props.theme.baseTheme.palette.primary1Color}}>account_circle</i>
  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    const backgroundColor = palette.primary1Color;
    const buttom1Color = palette.primary1Color;
    const buttom2Color = Colors.pinkA200;
    const borderColor = palette.borderColor;
    const textColor = palette.textColor;
    const disabledColor = palette.disabledColor;
    const styles = {
      background: {
        backgroundColor: backgroundColor,
        height: '100vh',
        position: 'fixed',
        width: '100%',
        zIndex: '-1000'
      },
      tableContainer: {
        display: 'table',
        margin: 'auto',
      },
      cellContainer: {
        display: 'table-cell',
        verticalAlign: 'middle',
      },
      paper: {
        padding: '20px',
        margin: '3rem auto 2rem auto',
        borderRadius: '3px'
      },
      photo: {
        margin: '0px auto 20px auto',
        width: '150px',
        height: '150px',
      },
      avatar: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      },
      avatarIcon: {
        margin: '0px', 
        fontSize: '150px', 
        backgroundColor: backgroundColor
      },
      group: {
        padding: '0 20px',
      },
      icon: {
        fontSize: '32px', 
        color: backgroundColor
      },
      input: {
        marginLeft: '10px',
      },
      verifyCodeInput: {
        marginLeft: '10px',
        width: '132px',
      },
      verifyCodeBtn: {
        top: '-10px',
        backgroundColor: this.props.authCodeCounter>0? disabledColor: buttom1Color,
        color: 'white',
        letterSpacing: '2px',
        marginLeft: '10px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
        width: '112px'
      },
      checkBox: {
        fontSize: '16px',
        display: 'inline-block',
        width: 'auto',
        whiteSpace: 'nowrap',
        margin: '20px 40px 0px 0px',
      },
      checkBoxIconStyle: {
        fontSize: '16px',
        marginRight: '4px',
      },
      commitBtn: {
        fontSize: '24px',
        backgroundColor: buttom2Color,
        color: 'white',
        letterSpacing: '60px',
        width: '100%',
        height: '50px',
        marginTop: '20px',// 40px 0px 0px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
      },
      divider: {
        margin: '40px 0px 10px 0px',
      },
      a: {
        fontSize: '15px',
        color: buttom1Color,
        cursor: 'pointer',
      },
      aDivider: {
        fontSize: '15px',
        color: buttom1Color,
      }
    }
    return styles
  }
}


