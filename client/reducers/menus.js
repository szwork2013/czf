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
    name: '房屋',
    leftIcon: 'domain',
    key: '/houses',
  }, {
    type: 'MENU',
    name: '统计',
    leftIcon: 'account_balance',
    key: '/accountBalance',
    menus: [{
      type: 'MENU',
      name: '房屋统计',
      leftIcon: 'list',
      key: '/statistics/houses',
    }]
  }, {
    type: 'DIVIDER',
  }, {
    type: 'MENU',
    name: '配置',
    leftIcon: 'settings',
    key: '/settings',
    menus: [{
      type: 'MENU',
      name: '私有资产',
      leftIcon: 'location_city',
      key: '/mansions',
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

