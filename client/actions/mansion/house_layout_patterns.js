'use strict';

import { GET_HOUSE_LAYOUT_PATTERNS_SUCCESS } from '../../constants/actionTypes';
import { CALL_API_V1 } from '../../middleware/api';
import { APP_STATE } from '../../reducers/master/app_state'

/*
 * 发送验证码
 */
function requestHouseLayoutPatterns() {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_HOUSE_LAYOUT_PATTERNS_SUCCESS
      },
      url: '/mansions/houseLayoutPatterns',
      method: 'GET'
    }
  };
}
export function requestHouseLayoutPatternsClick() {
  return dispatch => dispatch(requestHouseLayoutPatterns());
}