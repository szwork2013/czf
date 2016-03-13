'use strict';

import * as types from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';


function requestSignIn(formData) {
  return {
    [CALL_API_V1]: {
      types: [ types.REQUEST, types.SIGNIN_SUCCESS, types.FAILURE ],
      url: '/api/signin',
      method: 'POST',
      data: formData
    }
  };
}


export function signinSubmit(formData) {
  return dispatch => dispatch(requestSignIn(formData));
}
