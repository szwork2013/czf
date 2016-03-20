'use strict';
import log from '../utils/log'
import _ from 'lodash'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from 'material-ui/lib/styles/colors';
import { Paper, Avatar, FontIcon, FlatButton, Divider, ClearFix, LeftNav, List, ListItem } from 'material-ui/lib'

import * as UserActions from '../actions/user'
import * as SignActions from '../actions/signin';
import * as ToastActions from '../actions/master/toast';


import { SIGNIN } from '../constants/actionTypes';

class SideBar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  
  render() {
    const styles = this.getStyles();
    const sideBarStatu = this.props.sideBar;
    return (
        <LeftNav 
          open={sideBarStatu.isShow}
          style={this.props.sideBarStyle}
          >
          <div onTouchTap={this.handleTouchTapHeader}>
            Material-UI
          </div>
        </LeftNav>

    )
  }


  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    const backgroundColor = palette.primary1Color;
    const buttom1Color = palette.primary1Color;
    const buttom2Color = Colors.pinkA200;
    const borderColor = palette.borderColor;
    const textColor = palette.textColor;
    const disabledColor = palette.disabledColor;
    const styles = {

    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    user: state.user,
    sideBar: state.sideBar
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
)(SideBar);