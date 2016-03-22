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

class SideBar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      userDetailDropMenusOpen: false,
      userDetailDropMenusAnchorEl: null,
    }
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
  getUserDetailDropMenus(styles) {
    function userDetailDropMenusTouchTap(e) {
      e.preventDefault();
      this.setState({
        userDetailDropMenusOpen: true,
        userDetailDropMenusAnchorEl: e.currentTarget,
      });
    }
    function userDetailDropMenusClose(e) {
      this.setState({
        userDetailDropMenusOpen: false,
      });
    }
    function userDetailDropMenusIcon() {
      return (
        <FontIcon className="material-icons" color={'white'} style={styles.userDetailsAvatarIcon} >expand_more</FontIcon>
      );
    }
    return (
      <div>
        <RaisedButton label={this.props.user.user.firstName} backgroundColor={'rgba(0,0,0,0)'} 
          style={styles.userDetailDropMenusButton} labelStyle={styles.userDetailDropMenusLabel}
          onTouchTap={userDetailDropMenusTouchTap.bind(this)} 
          labelPosition="before"
          icon={userDetailDropMenusIcon.bind(this)(styles)} />
        <Popover
          style={styles.userDetailDropMenus}
          open={this.state.userDetailDropMenusOpen}
          anchorEl={this.state.userDetailDropMenusAnchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={userDetailDropMenusClose.bind(this)}
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
  getMainMenus(styles) {
    var dividerKeyCounter = 1;
    function onTouchTap(key, e) {
      // this.props.actions.menuChange(key);
      browserHistory.push(key);
    }
    function getMenus(menus, selectedKey, level = 0) {
      let mainMenusItemStyle = _.assign({}, styles.mainMenusItem);
      mainMenusItemStyle.backgroundColor = 'rgba(255, 255, 255,' + (level * 0.5) + ')';
      mainMenusItemStyle.fontSize = (16 - level) + 'px';
      mainMenusItemStyle.lineHeight = (16 - level) + 'px';
      let retMenus = menus.map((menu) => {
        // log.info(menu.key, selectedKey, menu.key==selectedKey)
        switch (menu.type) {
          case 'MENU':
            let leftIcon = (
              <FontIcon className="material-icons">menu</FontIcon>
            );
            if (menu.leftIcon) {
              leftIcon = (
                <FontIcon className="material-icons">{menu.leftIcon}</FontIcon>
              );
            }

            if (menu.menus) {
              let nestedItems = getMenus.bind(this)(menu.menus, selectedKey, level+1)
              return (
                <ListItem key={menu.key} primaryText={menu.name} value={menu.key} leftIcon={leftIcon} 
                  nestedListStyle={styles.mainMenusNestedStyle}
                  style={mainMenusItemStyle} 
                  primaryTogglesNestedList={true} nestedItems={nestedItems}/>
              )
            } else {
              return (
                <ListItem key={menu.key} primaryText={menu.name} value={menu.key} leftIcon={leftIcon} 
                  style={menu.key===selectedKey? styles.mainMenusItemSelected: mainMenusItemStyle} 
                  onTouchTap={onTouchTap.bind(this, menu.key)}/>
              )
            }
          break;
          case 'DIVIDER':
            return (
              <Divider key={'main_menus_divider_key_'+(dividerKeyCounter++)} style={styles.mainMenusDivider}/>
            )
          break;
        }
      })
      return retMenus;
    }
    return (
      <div>
        { getMenus.bind(this)(this.props.menus.menus, this.props.menus.selectedKey)}
      </div>
    )
  }
  
  render() {
    const styles = this.getStyles();
    const sideBarStatu = this.props.sideBar;

    /*
     * 用户信息
     */
    function defaultAvatar(styles) {
      return (
        <FontIcon className="material-icons" style={styles.userDetailsAvatarIcon}>account_circle</FontIcon>
      );
    }
    
    return (

        <LeftNav 
          open={sideBarStatu.isShow}
          style={this.props.sideBarStyle}
          >
            <div style={styles.userDetails}>
              <div style={styles.userDetailsPhoto}>
              {
                this.props.user && this.props.user.photo ?
                  <Avatar url={this.props.user.photo} size={150} style={styles.userDetailsAvatar}/> : 
                  <Avatar size={64} icon={defaultAvatar.bind(this)(styles)} style={styles.userDetailsAvatar}/>
              }
              </div>
              <div >
               { this.getUserDetailDropMenus.bind(this)(styles) }
              </div>
              <div style={{clear: 'both'}}></div>
            </div>
            { this.getMainMenus.bind(this)(styles) }
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
      mainMenus: {

      },
      mainMenusNestedStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        padding: '0px 0px 0px 0px',
        paddingTop: '0px',
        paddingBottom: '0px',
      },
      mainMenusItem: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
      },
      mainMenusItemSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      },
      mainMenusDivider: {
        marginTop: '0px'
      }
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