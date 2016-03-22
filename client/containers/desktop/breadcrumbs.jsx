'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Paper, Avatar, FontIcon, RaisedButton, Menu, Popover, MenuItem, Divider, ClearFix, LeftNav, List, ListItem } from 'material-ui/lib'


import * as UserActions from '../../actions/user'
import * as ToastActions from '../../actions/master/toast';

import { getMenusLinkByKey } from '../../utils/menus'

class Breadcrumbs extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  getMenusLink(styles) {
    const menusLink = getMenusLinkByKey(null, this.props.menus.menus, this.props.menus.selectedKey)
    let menusLinkString = ''
    let menu = menusLink
    while (menu) {
      menusLinkString += ' / ' + menu.name
      menu = menu._child_
    }
    return menusLinkString;
  }

  render() {
    const styles = this.getStyles();
    function homeIcon(styles) {
      return (
        <FontIcon className="material-icons" style={styles.homeIcon}>home</FontIcon>
      );
    }
    return (
      <div style={this.props.breadcrumbsStyle}>
        {homeIcon(styles)}<span style={styles.menusLink}>{this.getMenusLink(styles)}</span>
      </div>
    )
  }

  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    const disabledColor = palette.disabledColor;
    const styles = {

      homeIcon: {
        verticalAlign: 'middle',
        paddingRight: '8px',
        color: disabledColor,
      },
      menusLink: {
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'bottom',
        lineHeight: '32px',
        color: disabledColor,
      }
    }
    return styles;
  }

}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    // deviceSize: state.mui.deviceSize,
    // isLoading: state.loading,
    user: state.user.user,
    menus: state.menus
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