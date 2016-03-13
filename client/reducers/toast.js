'use strict';

import { OPEN_TOAST, CLOSE_TOAST } from '../constants/actionTypes';

const initState = {
  message: '',
  status: 200,
  isOpen: false,
  duration: 3000
};

export default function toast(toast = initState, action) {
  let newToast = Object.assign({}, toast, action.toast);
  delete newToast.type;
  switch (action.type) {
    case OPEN_TOAST:
      newToast.isOpen = true;
      return newToast;
      break;
    case CLOSE_TOAST:
      newToast.isOpen = false;
      return newToast;
      break;
    default:
      return toast;
  }
}
