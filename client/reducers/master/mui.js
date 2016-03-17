'use strict';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import { SET_THEME, SET_DEVICE_SIZE } from '../../constants/actionTypes';
import _ from 'lodash'


import {StyleResizable} from 'material-ui/lib/mixins';


const initialState = {
  theme: getMuiTheme(),
  deviceSize: StyleResizable.statics.Sizes.SMALL
};


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return _.assign({}, state, {
        theme: action.theme
      });
    case SET_DEVICE_SIZE: 
      return _.assign({}, state, {
        deviceSize: action.deviceSize
      });
    default:
      return state;
  }
};

