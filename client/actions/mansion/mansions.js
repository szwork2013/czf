'use strict';

import { GET_MANSIONS_SUCCESS, GET_MANSIONS_INFO_SUCCESS, ADD_MANSION_SUCCESS, DELETE_MANSION_SUCCESS } from '../../constants/actionTypes';
import { CALL_API_V1 } from '../../middleware/api';
import { APP_STATE } from '../../reducers/master/app_state'

/*
 * 查询所有和管理的所有物业
 */
function requestMansions() {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_MANSIONS_SUCCESS
      },
      url: '/mansions/all',
      method: 'GET'
    }
  };
}
export function requestMansionsClick() {
  return dispatch => dispatch(requestMansions());
}

/*
 * 查询单个物业的详细
 */
function requestMansionInfo(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_MANSIONS_INFO_SUCCESS
      },
      url: '/mansion/info',
      method: 'GET',
      data: formData
    }
  };
}
export function requestMansionInfoClick(formData) {
  return dispatch => dispatch(requestMansionInfo(formData));
}

/*
 * 新建单个物业
 */
function addMansion(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: ADD_MANSION_SUCCESS
      },
      url: '/mansion',
      method: 'POST',
      data: formData
    }
  };
}
export function addMansionClick(formData) {
  return dispatch => dispatch(addMansion(formData));
}


/*
 * 删除单个物业
 */
function deleteMansion(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: DELETE_MANSION_SUCCESS
      },
      url: '/mansion',
      method: 'DELETE',
      data: formData
    }
  };
}
export function deleteMansionClick(formData) {
  return dispatch => dispatch(deleteMansion(formData));
}
