'use strict';

import { GET_USER_SUCCESS } from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';
import { APP_STATE } from '../reducers/master/app_state'
import _ from 'lodash'

/*
 * 取得用户
 */
function getUser(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_USER_SUCCESS
      },
      url: '/user',
      method: 'GET',
      data: formData
    }
  };
}
export function getUserClick(formData) {
  return dispatch => dispatch(getUser(formData));
}