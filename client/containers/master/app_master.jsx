'use strict';
import log from '../../utils/log'
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../../components/master/loading';
import Toast from '../../components/master/toast';
import { Session } from '../../utils/session';
import { Storage } from '../../utils/storage';

import { APP_STATE } from '../../constants/const'


/*
 * 用于控制手动刷新，提高性能
 */
const APPMasterHelper = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      appState: {}
    };
  },

  getInitialState() {
    return {};
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.appState.reflush === false) {
      return false;
    }
    return true;
  },

  render() {
    return this.props.children;
  }
});


/*
 * 加入全局Loading和Toast
 */
const APPMaster = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },


  shouldComponentUpdate(nextProps, nextState) {
    return true;
  },

  render() {
    return (
      <div>
        <APPMasterHelper appState={this.props.appState}>
          { this.props.children }
        </APPMasterHelper>
        {this.props.isLoading && <Loading />}
        <Toast />
      </div>
    )
  }
});

function mapStateToProps(state) {
  return {
    appState: state[APP_STATE],
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(APPMaster);



