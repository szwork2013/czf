'use strict';

import { SAVE_USER_TO_REDUX, GET_SELF, GET_SELF_SUCCESS, GET_SELF_FAILURE, USER_CLEAR_TYPE } from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';


export function saveUserToRedux(obj) {
  return Object.assign({type: SAVE_USER_TO_REDUX}, obj);
};


function requestSelf(token) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_SELF_SUCCESS,
         failureType: GET_SELF_FAILURE
      },
      url: '/user/self',
      headers: {'authorization': token, 'content-type': 'application/x-www-form-urlencoded'},
      method: 'GET'
    }
  };
}
export function requestSelfClick(token) {
  return dispatch => dispatch(requestSelf(token));
}

export function userClearType() {
  return {
    type: USER_CLEAR_TYPE
  }
}

