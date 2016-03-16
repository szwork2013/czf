'use strict';

import { SAVE_USER_TO_REDUX, GET_SELF, GET_SELF_SUCCESS, GET_SELF_FAILURE, USER_CLEAR_TYPE } from '../constants/actionTypes';
import { Storage } from '../utils/storage'; 
import { Session } from '../utils/session'; 

let user = Storage.get('user', 'object') || {}
let token = Storage.get('token') || ''
let expiresIn = Number(Storage.get('expiresIn') || '-1')

const initialState = {
  user,
  token,
  expiresIn
};

export default function user(state=initialState, action) {
  var newState = {}
  switch (action.type) {
    case GET_SELF_SUCCESS:
      newState = Object.assign({}, state, {type: GET_SELF})
    case SAVE_USER_TO_REDUX:
      var data = action.resData.data
      if (data.user) newState.user = data.user
      if (data.token) newState.token = data.token
      if (data.expiresIn) newState.expiresIn = data.expiresIn
      return newState;

    case GET_SELF_FAILURE:
      return Object.assign({}, state, {type: GET_SELF, token: ''});

    case USER_CLEAR_TYPE:
      newState = Object.assign({}, state)
      delete newState.type
      return newState

    default:
      return state;
  }
};

