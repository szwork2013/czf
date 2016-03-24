'use strict';
import log from '../../utils/log'
import _ from 'lodash'

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { Paper, Avatar, FontIcon, RaisedButton, Menu, Popover, MenuItem, Divider, ClearFix, LeftNav, List, ListItem } from 'material-ui/lib'


class SideBarUserDetail extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      userDetailDropMenusOpen: false,
      userDetailDropMenusAnchorEl: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.user.firstName === this.props.user.firstName &&
        nextState.userDetailDropMenus === this.state.userDetailDropMenusOpen) {
      return false;
    }
    return true;
  }

  /*
   * 用户信息下拉处理
   */
  userDetailDropMenusChange(e, selectedValue) {
    this.setState({userDetailDropMenusOpen: false})
    switch (selectedValue) {
      case 'UserInfo': 
        browserHistory.push('/profile')
        break;
      case 'Exist':
        this.props.actions.requestSignout();
        browserHistory.push('/signin');
        break;
    }
  }

  userDetailDropMenusTouchTap(e) {
    e.preventDefault();
    this.setState({
      userDetailDropMenusOpen: true,
      userDetailDropMenusAnchorEl: e.currentTarget,
    });
  }
  userDetailDropMenusClose(e) {
    this.setState({
      userDetailDropMenusOpen: false,
    });
  }

  getUserDetailDropMenus(styles) {
    return (
      <div>
        <RaisedButton label={this.props.user.firstName} backgroundColor={'rgba(0,0,0,0)'} 
          style={styles.userDetailDropMenusButton} labelStyle={styles.userDetailDropMenusLabel}
          onTouchTap={this.userDetailDropMenusTouchTap.bind(this)} 
          labelPosition="before"
          icon={(
            <FontIcon className="material-icons" color={'white'} style={styles.userDetailsAvatarIcon} >expand_more</FontIcon>
            )} />
        <Popover
          style={styles.userDetailDropMenus}
          open={this.state.userDetailDropMenusOpen}
          anchorEl={this.state.userDetailDropMenusAnchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.userDetailDropMenusClose.bind(this)}
        >
          <Menu zDepth={0} onChange={this.userDetailDropMenusChange.bind(this)} >
            <MenuItem style={styles.userDetailDropMenusItem} value={'UserInfo'} primaryText="用户信息" 
              leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}/>
            <Divider />
            <MenuItem style={styles.userDetailDropMenusItem} value={'Exist'} primaryText="退出" 
              leftIcon={<FontIcon className="material-icons">clear</FontIcon>} />
          </Menu>
        </Popover>
      </div>
    );
  }

  render() {
    const styles = this.getStyles();
    const sideBarStatu = this.props.sideBar;
    return (
      <div style={styles.userDetails}>
        <div style={styles.userDetailsPhoto}>
        {
          this.props.user && this.props.user.photo ?
            <Avatar url={this.props.user.photo} size={150} style={styles.userDetailsAvatar}/> : 
            <Avatar size={64} icon={(
                <FontIcon className="material-icons" style={styles.userDetailsAvatarIcon}>account_circle</FontIcon>
              )} 
              style={styles.userDetailsAvatar}/>
        }
        </div>
        <div >
         { this.getUserDetailDropMenus.bind(this)(styles) }
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }

  getStyles() {
    const styles = {
      userDetails: {
        background: 'url(/public/images/user-bg.jpg) no-repeat center center',
        padding: '15px 0px 10px 15px'
      },
      userDetailsPhoto: {
        float: 'left',
        // margin: '0px auto 20px auto',
        width: '64px',
        height: '64px',
      },
      userDetailsAvatar: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        margin: '0px',
      },
      userDetailsAvatarIcon: {
        margin: '0px', 
        fontSize: '64px', 
        // backgroundColor: backgroundColor
      },
      userDetailDropMenusButton: {
        boxShadow: 'none',
        marginTop: '15px',
        backgroundColor: 'rgba(0,0,0,0)',

      },
      userDetailDropMenus: {
        // marginRight: '32px',
      },
      userDetailDropMenusItem: {
        // paddingRight: '24px',
      },
      userDetailDropMenusLabel: {
        color: 'rgba(255, 255, 255, 0.87)',
        paddingLeft: '8px',
        paddingRight: '0px',
        textTransform: 'none',
        fontSize: '16px',
        lineHeight: '16px',
        fontWeight: 500,
        overflow: 'hidden',
      },
      userDetailDropMenusIcon: {
        margin: '0px', 
        fontSize: '16px', 
        fontWeight: 500,
        // backgroundColor: 'rgba(255, 255, 255, 0.87)',
        color: 'rgba(255, 255, 255, 0.87)',
      },
    }
    return styles;
  }
}

export default SideBarUserDetail;






