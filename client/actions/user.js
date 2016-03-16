'use strict';

import { SAVE_USER_TO_REDUX } from '../constants/actionTypes';

export function saveUserToRedux(obj) {
  let retObj = {type: SAVE_USER_TO_REDUX}
  if (obj.user) retObj.user = obj.user
  if (obj.token) retObj.token = obj.token
  return retObj
};

