'use strict';

import * as types from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';


function requestSignIn(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: types.SIGNIN_SUCCESS
      },
      url: '/signin/name',
      method: 'POST',
      data: formData
    }
  };
}


export function signinSubmit(formData) {
  return dispatch => dispatch(requestSignIn(formData));
}
