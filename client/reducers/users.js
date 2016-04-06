'use strict';

import _ from 'lodash'

import { SIGNOUT, USER_RESTORE, GET_USER_SUCCESS } from '../constants/actionTypes';

import { Storage } from '../utils/storage'; 
import { Session } from '../utils/session'; 

let user = Storage.get('user', 'object') || {}

var initialState = {};

if (user && user._id) {
  initialState[user._id] = user
}

export default function users(state=initialState, action) {
  var newState = {}
  var user = null
  switch (action.type) {
    case USER_RESTORE:
      if (action.user!==undefined) {
        newState = _.assign({}, state);
        newState[action.user._id] = action.user;
        return newState;
      }
      return state;

    case GET_USER_SUCCESS:
      user = action.resData.data.user
      if (user) {
        newState = _.assign({}, state);
        newState[user._id] = user;
        return newState;
      }
      return state;

    case SIGNOUT:
      return initialState;

    default:
      return state;
  }
};

