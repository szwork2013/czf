'use strict';
import log from '../utils/log'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import * as UserActions from '../actions/user'
import * as ToastActions from '../actions/toast';

import Loading from '../components/loading';
import Toast from '../components/toast';

class Desktop extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <div>Desktop</div>
        { children }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    user: state.user.user,
    token: state.user.token
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ToastActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Desktop);