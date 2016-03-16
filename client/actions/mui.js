'use strict';

import { SET_THEME, SET_DEVICE_SIZE } from '../constants/actionTypes';

export function setTheme(theme) {
  return {
    type: SET_THEME,
    theme
  };
};

export function setDeviceSize(deviceSize) {
  return {
    type: SET_DEVICE_SIZE,
    deviceSize
  };
};

