'use strict';
import log from '../utils/log'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as SignActions from '../actions/signin';
import * as ToastActions from '../actions/toast';

import SignInForm from '../components/signin_form';
import Loading from '../components/loading';
import Toast from '../components/Toast';
import { Session } from '../utils/session';



class SignIn extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentWillUpdate(nextProps) {
    const { success, data } = nextProps;

    if (success) {
      const { token, user } = data;
      Session.set('token', token);
      Session.set('user', user);
      browserHistory.push('/');
    };
  }

  render() {
    const { isLoading, actions, toast } = this.props;
    return (
      <div>
        <SignInForm
          openToast={actions.openToast}
          signinSubmit={actions.signinSubmit}
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
    isLoading: state.loading,
    data: state.signin.data,
    success: state.signin.success,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SignActions, ToastActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
