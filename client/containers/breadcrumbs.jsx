'use strict';
import log from '../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import * as UserActions from '../actions/user'
import * as ToastActions from '../actions/master/toast';


class Breadcrumbs extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  render() {
    return (
      <div>
        <div>Breadcrumbs</div>
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
    actions: bindActionCreators(_.assign({}, ToastActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs);