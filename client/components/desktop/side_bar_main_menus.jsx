'use strict';
import log from '../../utils/log'
import _ from 'lodash'

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { Paper, Avatar, FontIcon, RaisedButton, Menu, Popover, MenuItem, Divider, ClearFix, LeftNav, List, ListItem } from 'material-ui/lib'


class SideBarMainMenus extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {  }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // log.info(nextProps.selectedKey, this.props.selectedKey, nextProps.selectedKey === this.props.selectedKey)
    if (nextProps.selectedKey === this.props.selectedKey) {
      return false;
    }
    return true;
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
        { getMenus.bind(this)(this.props.menus, this.props.selectedKey)}
      </div>
    )
  }

  render() {
    const styles = this.getStyles();
    return this.getMainMenus(styles);
  }
  getStyles() {
    const styles = {
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

export default SideBarMainMenus;

