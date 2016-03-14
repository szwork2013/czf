'use strict';
import log from '../utils/log'
import React, { Component, PropTypes } from 'react';
import { connect,  } from 'react-redux';
import Snackbar from 'material-ui/lib/snackbar';
import { closeToast } from '../actions/toast';

class Toast extends Component {
  handleRequestClose() {
    const { dispatch } = this.props;
    dispatch(closeToast());
  }

  render() {
    const { msg, status, isOpen, duration } = this.props.toast;
    return (
      <Snackbar
        open={isOpen}
        message={msg}
        autoHideDuration={duration}
        onRequestClose={this.handleRequestClose.bind(this)}
        />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    toast: state.toast
  };
};

export default connect(mapStateToProps)(Toast);
