'use strict';

import { SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAILURE, 
        GET_AUTH_CODE, GET_AUTH_CODE_SUCCESS, GET_AUTH_CODE_FAILURE, 
        CLEAR_SIGN, REMEMBER_ME, AUTO_SIGNIN } from '../constants/actionTypes';

import { Storage } from '../utils/storage'; 

const initialState = {
  isRememberMe: Storage.get('isRememberMe')==='true',
  isAutoSignin: Storage.get('isAutoSignin')==='true',
  type: '',
  status: 200,
  data: {}
};

export function signin(state=initialState, action) {
  switch (action.type) {
    case REMEMBER_ME:
      Storage.set('isRememberMe', action.isRememberMe);
      if (!action.isRememberMe) {
        Storage.remove('user')
      }
      return Object.assign({}, state, {
        isRememberMe: action.isRememberMe
      });
    case AUTO_SIGNIN:
      Storage.set('isAutoSignin', action.isAutoSignin);
      if (!action.isAutoSignin) {
        Storage.remove('token')
      }
      return Object.assign({}, state, {
        isAutoSignin: action.isAutoSignin
      });

    case GET_AUTH_CODE_SUCCESS: 
    case GET_AUTH_CODE_FAILURE:
      return Object.assign({}, state, {
        type: GET_AUTH_CODE,
        data: action.resData,
        status: action.resStatus
      });

    case SIGNIN_SUCCESS:
    case SIGNIN_FAILURE:
      return Object.assign({}, state, {
        type: SIGNIN,
        data: action.resData,
        status: action.resStatus
      });

    case CLEAR_SIGN:
      return Object.assign({}, state, {type: '', status: 200, data: {}});

    default:
      return state;
  }
};

