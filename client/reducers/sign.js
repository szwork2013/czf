'use strict';

import _ from 'lodash'


import { SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAILURE, 
        GET_AUTH_CODE, GET_AUTH_CODE_SUCCESS, GET_AUTH_CODE_FAILURE, 
        SIGNIN_CLEAN, SIGNIN_TYPE_CLEAN, REMEMBER_ME, AUTO_SIGNIN } from '../constants/actionTypes';

import { Storage } from '../utils/storage'; 

const initialState = {
  type: '',
  isRememberMe: Storage.get('isRememberMe')==='true',
  isAutoSignin: Storage.get('isAutoSignin')==='true',
  status: 200,
  data: {}
};

export function signin(state=initialState, action) {
  switch (action.type) {
    //记住用户名
    case REMEMBER_ME:
      // Storage.set('isRememberMe', action.isRememberMe);
      // if (!action.isRememberMe) {
      //   Storage.remove('user')
      // }
      return _.assign({}, state, {
        isRememberMe: action.isRememberMe
      });
    case AUTO_SIGNIN:
      // Storage.set('isAutoSignin', action.isAutoSignin);
      // if (!action.isAutoSignin) {
      //   Storage.remove('token')
      // }
      return _.assign({}, state, {
        isAutoSignin: action.isAutoSignin
      });

    case GET_AUTH_CODE_SUCCESS: 
    case GET_AUTH_CODE_FAILURE:
      return _.assign({}, state, {
        type: GET_AUTH_CODE,
        data: action.resData,
        status: action.resStatus
      });

    case SIGNIN_SUCCESS:
    case SIGNIN_FAILURE:
      return _.assign({}, state, {
        type: SIGNIN,
        data: action.resData,
        status: action.resStatus
      });

    case SIGNIN_CLEAN:
      return _.assign({}, state, {type: '', status: 200, data: {}});

    case SIGNIN_TYPE_CLEAN:
      return _.assign({}, state, {type: ''});

    default:
      return state;
  }
};

