'use strict';

import { OPEN_TOAST, CLOSE_TOAST } from '../constants/actionTypes';


export function openToast(obj) {
  return {
    type: OPEN_TOAST,
    status: obj.status,
    message: obj.msg
  };
}

export function closeToast() {
  return {
    type: CLOSE_TOAST
  };
}
