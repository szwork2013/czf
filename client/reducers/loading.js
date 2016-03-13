'use strict';

import { LOADING_ON, LOADING_OFF} from '../constants/actionTypes';

export default (state = false, action) => {
  switch (action.type) {
    case LOADING_ON:
      return true;
    case LOADING_OFF:
      return false;
    default:
      return state;
  }
};

