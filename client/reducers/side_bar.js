'use strict';

import { SIDE_BAR_SHOW, SIDE_BAR_HIDE } from '../constants/actionTypes';
import _ from 'lodash'

const menus = [
  {
    type: 'MENU',
    name: '父菜单1',
    menus: [{
      type: 'MENU',
      name: '子菜单1',
      url: '',
    }]
  }, {
    type: 'DIVIDER',
  }, {
    type: 'MENU',
    name: '子菜单1',
    url: '',
  },

]

const initialState = {
  isShow: true,
  menus,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case SIDE_BAR_SHOW:
      return _.assign({}, state, {
        isShow: true
      });
    case SIDE_BAR_HIDE: 
      return _.assign({}, state, {
        isShow: false
      });
    default:
      return state;
  }
};

