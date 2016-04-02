'use strict';

import { OPEN_TOAST, CLOSE_TOAST } from '../../constants/actionTypes';
import _ from 'lodash'


const initState = {
  msg: '',
  status: 200,
  isOpen: false,
  duration: 1000 * 5
};

export default function toast(toast = initState, action) {
  let newToast = _.assign({}, toast, action);
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
