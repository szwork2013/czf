'use strict';

import { SIGNIN_SUCCESS, GET_AUTH_CODE_SUCCESS, 
  SIGNIN_CLEAN, SIGNIN_TYPE_CLEAN, 
  REMEMBER_ME,  AUTO_SIGNIN} from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';
import { APP_STATE } from '../reducers/master/app_state'

/*
 * 发送验证码
 */
function requestAuthCode(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_AUTH_CODE_SUCCESS
      },
      url: '/authCode',
      method: 'POST',
      data: formData
    }
  };
}
export function authCodeClick(formData) {
  return dispatch => dispatch(requestAuthCode(formData));
}
export function signinClean() {
  return {
    type: SIGNIN_CLEAN,
    [APP_STATE]: {
      reflush: false
    }

  }
}
export function signinTypeClean() {
  return {
    type: SIGNIN_TYPE_CLEAN,
    [APP_STATE]: {
      reflush: false
    }

  }
}

/*
 * 记住用户名
 */
export function rememberMe(isRememberMe) {
  return {
    type: REMEMBER_ME,
    isRememberMe
  }
}

/*
 * 自动登陆
 */
export function autoSignin(isAutoSignin) {
  return {
    type: AUTO_SIGNIN,
    isAutoSignin
  }
}

/*
 * 登陆
 */
function requestSignin(formData, url) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: SIGNIN_SUCCESS
      },
      url,
      method: 'POST',
      data: formData
    }
  };
}
export function signinNameSubmit(formData) {
  return dispatch => dispatch(requestSignin(formData, '/signin/name'));
}
export function signinAuthCodeSubmit(formData) {
  return dispatch => dispatch(requestSignin(formData, '/signin/mobile'));
}


