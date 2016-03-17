'use strict';

import { OPEN_TOAST, CLOSE_TOAST } from '../../constants/actionTypes';
import { APP_STATE } from '../../constants/const'


export function openToast(obj) {
  return {
    type: OPEN_TOAST,
    status: obj.status || 200,
    msg: obj.msg || '',
    [APP_STATE]: {
      reflush: false
    }
  };
}

export function closeToast() {
  return {
    type: CLOSE_TOAST,
    [APP_STATE]: {
      reflush: false
    }
  };
}
