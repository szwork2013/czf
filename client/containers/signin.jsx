'use strict';
import log from '../utils/log'
import _ from 'lodash'
import moment from 'moment'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as UserActions from '../actions/user'
import * as SignActions from '../actions/signin';
import * as ToastActions from '../actions/master/toast';

import SignInForm from '../components/signin_form';

import { Session } from '../utils/session';
import { Storage } from '../utils/storage';

import { SIGNIN, GET_AUTH_CODE, GET_SELF } from '../constants/actionTypes';


class SignIn extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      authCodeTimer: null,
      authCodeCounter: 0
    }
  }

  /*
   * 获限验证码结果
   */
  getAuthCodeCallback(nextProps) {
    const { status, data } = nextProps.signin;
    if (status===200) {
      this.setState({authCodeCounter: 60})
      if (!this.state.authCodeTimer) {
        let self = this;
        this.state.authCodeTimer = setInterval(()=>{
          let counter = self.state.authCodeCounter-1;
          self.setState({authCodeCounter: counter});
          if (counter<=0) {
            clearInterval(self.state.authCodeTimer)
            this.setState({authCodeTimer:null})
          }
        }, 1000);
      }
      this.props.actions.signinClean()
    } else {
      this.cleanAuthCode()
    }
    
  }
  //清除store中的验证码信息
  cleanAuthCode() {
    if (this.state.authCodeTimer) {
      clearInterval(this.state.authCodeTimer)
    }
    this.setState({authCodeTimer:null})
    this.setState({authCodeCounter: 0});
    this.props.actions.signinClean()
  }


  /*
   * 登陆结果
   */
  signinCallback(nextProps) {
    // log.error(nextProps.signin)
    let signin = nextProps.signin;
    let status = signin.status;
    let data = signin.data.data;
    let user = data.user
    let token = data.token
    let expiresIn = moment().add(Number(data.expiresIn), 'seconds').toDate();
    let actions = this.props.actions
    if (status===200) {
      if (signin.isRememberMe) {
        Storage.set('isRememberMe', true);
        Storage.set('user', user);
      } else {
        Storage.remove('isRememberMe');
        Storage.remove('user');
      }
      if (signin.isAutoSignin) {
        Storage.set('isAutoSignin', true);
        Storage.set('token', token);
        Storage.set('expiresIn', expiresIn);
      } else {
        Storage.remove('isAutoSignin');
        Storage.remove('token');
        Storage.remove('expiresIn');
      }
      actions.userRestore(_.assign({}, data, {expiresIn}));
      // actions.userTypeClean();
      this.cleanAuthCode();
      // Session.set('user', user);
      // Session.set('token', token);
      // browserHistory.push('/');
    }
  }

  /*
   * react 组件生命周期
   */
  componentWillReceiveProps(nextProps) {
    let signinType = nextProps.signin.type
    switch (signinType) {
      case GET_AUTH_CODE: 
        return this.getAuthCodeCallback(nextProps)
      case SIGNIN:
        return this.signinCallback(nextProps)
    }
  }

  componentWillUnmount() {
    this.cleanAuthCode()
  }

  render() {
    const { theme, deviceSize, isLoading, user, signin, actions } = this.props;
    const { authCodeCounter } = this.state;
    return (
      <div>
        <SignInForm
          theme={theme}
          deviceSize={deviceSize}
          user={user.user}
          authCodeCounter={authCodeCounter}
          isRememberMe={signin.isRememberMe}
          rememberMe={actions.rememberMe}
          isAutoSignin={signin.isAutoSignin}
          autoSignin={actions.autoSignin}
          signinType={signin.signinType}
          openToast={actions.openToast}
          signinNameSubmit={actions.signinNameSubmit}
          signinAuthCodeSubmit={actions.signinAuthCodeSubmit}
          authCodeClick={actions.authCodeClick}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    user: state.user,
    signin: state.signin
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, SignActions, ToastActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
