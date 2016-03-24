'use strict';
import log from '../../utils/log'
import _ from 'lodash'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from 'material-ui/lib/styles/colors';
import { Paper, Avatar, FontIcon, RaisedButton, Menu, Popover, MenuItem, Divider, ClearFix, LeftNav, List, ListItem } from 'material-ui/lib'
import { browserHistory } from 'react-router';


import * as UserActions from '../../actions/user';
import * as SignActions from '../../actions/signin';
import * as ToastActions from '../../actions/master/toast';

import { } from '../../constants/actionTypes';

import SideBarUserDetail from '../../components/desktop/side_bar_user_detail'
import SideBarMainMenus from '../../components/desktop/side_bar_main_menus'


class SideBar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      userDetailDropMenusOpen: false,
      userDetailDropMenusAnchorEl: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.sideBar.isShow === this.props.sideBar.isShow &&
        nextProps.menus.selectedKey === this.props.menus.selectedKey) {
      return false;
    }
    return true;
  }
  
  render() {
    // const styles = this.getStyles();

    return (
      <LeftNav open={this.props.sideBar.isShow} style={this.props.sideBarStyle}>
        <SideBarUserDetail user={this.props.user.user} actions={this.props.actions} />
        <SideBarMainMenus menus={this.props.menus.menus} selectedKey={this.props.menus.selectedKey} />
      </LeftNav>
    )
  }


  getStyles() {
    // const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    // theme: state.mui.theme,
    // deviceSize: state.mui.deviceSize,
    // isLoading: state.loading,
    user: state.user,
    sideBar: state.sideBar,
    menus: state.menus
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, UserActions, SignActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);