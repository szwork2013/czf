'use strict';

import _ from 'lodash'

import { USER_RESTORE, GET_SELF, GET_SELF_SUCCESS, GET_SELF_FAILURE, USER_TYPE_CLEAN, SIGNOUT } from '../constants/actionTypes';
import { Storage } from '../utils/storage'; 
import { Session } from '../utils/session'; 

let user = Storage.get('user', 'object') || {}
let token = Storage.get('token') || ''
let expiresIn = Storage.get('expiresIn', 'object') || ''
if (expiresIn) {
  try {
    expiresIn = new Date(expiresIn);
  } catch (err) {
    console.log(err)
    expiresIn = new Date();
  }
}

const initialState = {
  user,
  token,
  expiresIn
};

export default function user(state=initialState, action) {
  var newState = {}
  switch (action.type) {
    case USER_RESTORE:
      newState = _.assign({}, state);
      if (action.user!==undefined) newState.user = action.user
      if (action.token!==undefined) newState.token = action.token
      if (action.expiresIn!==undefined) newState.expiresIn = action.expiresIn
      return newState;

    case USER_TYPE_CLEAN:
      newState = _.assign({}, state)
      delete newState.type
      return newState

    case SIGNOUT:
      return _.assign({}, state, {token: null, expiresIn: null});


    default:
      return state;
  }
};

