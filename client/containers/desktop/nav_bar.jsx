'use strict';
import log from '../../utils/log'
import _ from 'lodash'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from 'material-ui/lib/styles/colors';
import { Paper, Avatar, FontIcon, TextField, FlatButton, Divider, ClearFix, AppBar, IconMenu, IconButton, MenuItem } from 'material-ui/lib'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { APP_NAME } from '../../constants/const'

import * as UserActions from '../../actions/user'
import * as SideBarActions from '../../actions/side_bar';
import * as ToastActions from '../../actions/master/toast';


class NavBar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  leftIconButtonTouchTap(e) {
    if (this.props.sideBar.isShow) {
      this.props.actions.sideBarHide()
    } else {
      this.props.actions.sideBarShow()
    }
  }
  getTitle(styles) {
    return (
      <span style={styles.title}>
        <FontIcon className="material-icons" style={styles.titleIcon}>location_city</FontIcon>
        {APP_NAME}
      </span>
    )
  }
  getLeftIcon(styles) {
    
  }
  render() {
    const styles = this.getStyles();
    return (
      <AppBar style={this.props.navBarStyle} showMenuIconButton={true}
              title={ this.getTitle(styles) } 
              onLeftIconButtonTouchTap={this.leftIconButtonTouchTap.bind(this)}
              iconElementRight={
                <div>
                  <IconMenu iconButtonElement={
                      <IconButton><MoreVertIcon color='white'/></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem primaryText="Help" />
                  </IconMenu>
                </div>
              }/>
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
      title: {
        fontWeight: '800',
      },
      titleIcon: {
        fontSize: '38px', 
        color: 'white',
        top: '10px',
        marginRight: '4px'
      },
      icon: {
        color: 'white',
        paddingTop: '0px',
        paddingBottom: '0px',
        position: 'relative',
        // lineHeight: '40px',
        fontSize: '32px',
      }
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    sideBar: state.sideBar,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, SideBarActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);