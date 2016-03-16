'use strict';
import log from '../utils/log'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as UserActions from '../actions/user'
import * as SignActions from '../actions/signin';
import * as ToastActions from '../actions/toast';

import SignInForm from '../components/signin_form';
import Loading from '../components/loading';
import Toast from '../components/toast';
import { Session } from '../utils/session';
import { Storage } from '../utils/storage';

import { SIGNIN, GET_AUTH_CODE } from '../constants/actionTypes';


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
  getAuthCodeCallback(status, data) {
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
    } else {
      this.cleanAuthCode()
    }
    this.props.actions.clearSigin()
  }
  //清除store中的验证码信息
  cleanAuthCode() {
    if (this.state.authCodeTimer) {
      clearInterval(this.state.authCodeTimer)
    }
    this.setState({authCodeTimer:null})
    this.setState({authCodeCounter: 0});
    this.props.actions.clearSigin()
  }

  /*
   * 登陆结果
   */
  signinCallback(status, data) {
    let signin = this.props.signin
    data = data.data;
    let user = data.user
    let token = data.token
    let actions = this.props.actions
    if (status===200) {
      if (signin.isRememberMe) {
        Storage.set('user', user);
      } else {
        Storage.remove('user');
      }
      if (signin.isAutoSignin) {
        Storage.set('token', token);
      } else {
        Storage.remove('token');
      }
      actions.saveUserToRedux(data)
    }
    this.cleanAuthCode()
    // this.props.actions.clearSigin()
  }

  /*
   * react 组件生命周期
   */
  componentWillReceiveProps(nextProps) {
    // log.info('SignInForm', nextProps.signin)
    const { type, status, data } = nextProps.signin;
    switch (type) {
      case GET_AUTH_CODE: 
        return this.getAuthCodeCallback(status, data)
      case SIGNIN:
        return this.signinCallback(status, data)
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
          user={user}
          authCodeCounter={authCodeCounter}
          isRememberMe={signin.isRememberMe}
          rememberMe={actions.rememberMe}
          isAutoSignin={signin.isAutoSignin}
          autoSignin={actions.autoSignin}
          openToast={actions.openToast}
          signinNameSubmit={actions.signinNameSubmit}
          signinAuthCodeSubmit={actions.signinAuthCodeSubmit}
          authCodeClick={actions.authCodeClick}
        />
        {isLoading &&
          <Loading />
        }
        <Toast />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    user: state.user.user,
    token: state.user.token,
    signin: state.signin
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SignActions, ToastActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
