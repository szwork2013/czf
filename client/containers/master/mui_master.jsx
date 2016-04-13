'use strict';
import log from '../../utils/log'
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {StyleResizable} from 'material-ui/lib/mixins';
import { setDeviceSize } from '../../actions/master/mui';
import Events from 'material-ui/lib/utils/events'


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';

const MUIMaster = React.createClass({
  manuallyBindResize: true,

  propTypes: {
    children: React.PropTypes.node
  },

  mixins: [
    StyleResizable,
  ],

  componentWillMount() {
    injectTapEventPlugin();
  },

  componentDidMount() {
    this._bindResize2();
  },

  componentWillUnmount() {
    this._unbindResize2();
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.deviceSize !== this.state.deviceSize) {
      // this.props.actions.setDeviceSize(nextState.deviceSize);
    }
    return true;
  },

  _bindResize2() {
    Events.on(window, 'resize', this._updateDeviceSize2);
  },

  _unbindResize2() {
    Events.off(window, 'resize', this._updateDeviceSize2);
  },

  _updateDeviceSize2() {
    StyleResizable._updateDeviceSize.bind(this)();
    if (this.state.deviceSize !== this.props.deviceSize) {
      // this.props.actions.setDeviceSize(this.state.deviceSize);
    }
  },

  render() {
    return this.props.children;
  }
});


function mapStateToProps(state) {
  return {
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({setDeviceSize: setDeviceSize}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MUIMaster);


