'use strict';

import { SIDE_BAR_SHOW, SIDE_BAR_HIDE } from '../constants/actionTypes';

export function sideBarShow() {
  return {
    type: SIDE_BAR_SHOW
  }
}

export function sideBarHide() {
  return {
    type: SIDE_BAR_HIDE
  }
}