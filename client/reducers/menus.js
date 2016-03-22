'use strict';

import { } from '../constants/actionTypes';
import _ from 'lodash'
import { getMenusLinkByKey, findMenuByKey, findMenuByValue } from '../utils/menus'
import { browserHistory } from 'react-router';
import { LOCATION_CHANGE } from 'react-router-redux';

const menus = [
  {
    type: 'MENU',
    name: 'Dashboard',
    leftIcon: 'dashboard',
    key: '/dashboard'
  }, {
    type: 'DIVIDER',
  }, {
    type: 'MENU',
    name: '配置',
    leftIcon: 'settings',
    key: '/settings',
    menus: [{
      type: 'MENU',
      name: '用户信息',
      leftIcon: 'account_circle',
      key: '/profile',
    },{
      type: 'MENU',
      name: '资产',
      leftIcon: 'location_city',
      key: '/mansions',
    }]
  }, {
    type: 'DIVIDER',
  }, {
    type: 'MENU',
    name: '例子父菜单',
    key: '/test_parent_1',
    menus: [{
      type: 'MENU',
      name: '例子子菜单1',
      key: '/test_child_1',
      menus: [{
        type: 'MENU',
        name: '例子子子菜单1',
        key: '/sub_1_sub_1',
      }],
    },{
      type: 'MENU',
      name: '例子子菜单2',
      value: '/sub2',
      key: '/test_child_2'
    }]
  }, {
    type: 'DIVIDER',
  },

]

const initialState = {
  menus,
  selectedKey: '/dashboard'
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case MENU_CHANGE:
    //   return _.assign({}, state, {selectedKey: action.selectedKey})
    //   break;
    case LOCATION_CHANGE:
      if ( action.payload.pathname === '/' ) {
        return _.assign({}, state, {selectedKey: '/dashboard'}) 
      }
      let menu = findMenuByKey(state.menus, action.payload.pathname)
      if (menu) {
        return _.assign({}, state, {selectedKey: menu.key})
      } else {
        return _.assign({}, state, {selectedKey: null})
      }
    default:
      return state;
  }
};

