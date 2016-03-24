'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Paper, Avatar, FontIcon, RaisedButton, Menu, Popover, MenuItem, Divider, ClearFix, LeftNav, List, ListItem, Toolbar, ToolbarGroup, ToolbarSeparator, IconMenu, IconButton } from 'material-ui/lib'
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'

import * as UserActions from '../../actions/user'
import * as ToastActions from '../../actions/master/toast';

import { getMenusLinkByKey } from '../../utils/menus'

class Breadcrumbs extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.menus.selectedKey === this.props.menus.selectedKey) {
      return false;
    }
    return true;
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
      <Toolbar style={this.props.breadcrumbsStyle}>
        <ToolbarGroup firstChild={true} float="left">
          {homeIcon(styles)}<span style={styles.menusLink}>{this.getMenusLink(styles)}</span>
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <ToolbarSeparator style={styles.toolbarSeparator}/>
          <FontIcon className="material-icons" style={styles.icon}>open_with</FontIcon>
          <IconMenu iconButtonElement={
              <IconButton style={styles.icon}  touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="More Info" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    )
  }

  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    const textColor = palette.textColor;
    const disabledColor = palette.disabledColor;
    const styles = {

      homeIcon: {
        verticalAlign: 'middle',
        paddingRight: '8px',
        fontSize: '24px',
        lineHeight: '40px',
        verticalAlign: 'middle',
        color: disabledColor,
      },
      menusLink: {
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'middle',
        fontSize: '12px',
        lineHeight: '44px',
        color: disabledColor,
      },
      toolbarSeparator: {
        top: '5px',
        height: '30px'
      },
      icon: {
        paddingTop: '0px',
        paddingBottom: '0px',
        position: 'relative',
        lineHeight: '40px',
        fontSize: '24px',
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
    // user: state.user.user,
    menus: state.menus
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs);