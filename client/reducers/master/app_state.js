'use strict';

import _ from 'lodash'
import log from '../../utils/log'

export const APP_STATE = '__APP_STATE_00000__'//Symbol('App State')

const initialState = {
  reflush: true
};

const appState = (state = initialState, action) => {
  var newState = _.assign({}, state);
  if (action[APP_STATE]) {
    let appState = action[APP_STATE];
    newState.reflush = appState.reflush === false ? false : true;
  } else {
    newState.reflush = true;
  }
  return newState;
};
exports.appState = appState;