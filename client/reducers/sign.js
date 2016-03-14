'use strict';

import { SIGNIN_SUCCESS, SIGNIN_FAILURE } from '../constants/actionTypes';

const initialState = {
  data: {}
};

export function signin(state=initialState, action) {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      let newStatus = Object.assign({}, state, {
        data: action.resData,
        status: action.resStatus
      });
      delete newStatus.error;
      return newStatus
      break;
    case SIGNIN_FAILURE:
      return Object.assign({}, state, {
        data: action.resData,
        status: action.resStatus
      });
    default:
      return state;
  }
};

