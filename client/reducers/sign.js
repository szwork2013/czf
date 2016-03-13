'use strict';

import { SIGNIN_SUCCESS } from '../constants/actionTypes';

const initialState = {
  data: {}
};

export function signin(state=initialState, action) {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return Object.assign({}, state, {
        data: action.resData,
        status: action.resStatus
      });
    default:
      return state;
  }
};

