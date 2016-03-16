'use strict';
import log from '../utils/log'
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {StyleResizable} from 'material-ui/lib/mixins';
import { setDeviceSize } from '../actions/mui';
import Events from 'material-ui/lib/utils/events'

const MUIMaster = React.createClass({
  manuallyBindResize: true,

  propTypes: {
    children: React.PropTypes.node
  },

  mixins: [
    StyleResizable,
  ],

  componentDidMount() {
    this._bindResize2();
  },

  componentWillUnmount() {
    this._unbindResize2();
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.deviceSize !== this.state.deviceSize) {
      this.props.actions.setDeviceSize(nextState.deviceSize);
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
      this.props.actions.setDeviceSize(this.state.deviceSize);
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


// class DAAAAAD extends Component {

//   constructor(props, context) {
//     super(props, context);
//   }

//   componentWillUpdate(nextProps) {
//     const { success, data } = nextProps;

//     if (success) {
//       const { token, user } = data;
//       Session.set('token', token);
//       Session.set('user', user);
//       browserHistory.push('/');
//     };
//   }

//   render() {
//     const { isLoading, actions, toast } = this.props;
//     return (
//       <div>
//         <SignInForm
//           openToast={actions.openToast}
//           signinSubmit={actions.signinSubmit}
//         />
//         {isLoading &&
//           <Loading />
//         }
//         <Toast />
//       </div>
//     );
//   }
// }

