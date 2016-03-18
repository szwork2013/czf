'use strict';

import { LOADING_ON, LOADING_OFF } from '../../constants/actionTypes';
import { APP_STATE } from '../../reducers/master/app_state'

export function loadingOn() {
  return {
    type: LOADING_ON,
    [APP_STATE]: {
      reflush: false
    }
  };
};

export function loadingOff() {
  return {
    type: LOADING_OFF,
    [APP_STATE]: {
      reflush: false
    }
  };
};

