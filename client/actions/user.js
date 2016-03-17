'use strict';

import { GET_SELF, GET_SELF_SUCCESS, GET_SELF_FAILURE, 
  USER_RESTORE, USER_TYPE_CLEAN } from '../constants/actionTypes';
import { CALL_API_V1 } from '../middleware/api';
import { APP_STATE } from '../constants/const';
import _ from 'lodash'

/*
 * obj格式为{user , token, expiresIn}
 */
export function userRestore(obj) {
  return _.assign({type: USER_RESTORE}, obj);
};


// function requestSelf(token) {
//   return {
//     [CALL_API_V1]: {
//       actions: {
//          successType: GET_SELF_SUCCESS,
//          failureType: GET_SELF_FAILURE
//       },
//       url: '/user/self',
//       headers: {'authorization': token},
//       method: 'GET'
//     }
//   };
// }
// export function requestSelfClick(token) {
//   return dispatch => dispatch(requestSelf(token));
// }

export function userTypeClean() {
  return {
    type: USER_TYPE_CLEAN,
    [APP_STATE]: {
      reflush: false
    }
  }
}

