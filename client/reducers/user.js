'use strict';

import _ from 'lodash'

import { USER_RESTORE, GET_SELF, GET_SELF_SUCCESS, GET_SELF_FAILURE, USER_TYPE_CLEAN } from '../constants/actionTypes';
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
      if (action.user) newState.user = action.user
      if (action.token) newState.token = action.token
      if (action.expiresIn) newState.expiresIn = action.expiresIn
      return newState;

    case USER_TYPE_CLEAN:
      newState = _.assign({}, state)
      delete newState.type
      return newState

    default:
      return state;
  }
};

