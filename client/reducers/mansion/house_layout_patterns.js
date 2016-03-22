'use strict';

import _ from 'lodash'
import log from '../../utils/log'


import { GET_HOUSE_LAYOUT_PATTERNS_SUCCESS } from '../../constants/actionTypes';



const initialState = [];


export default (state = initialState, action) => {
  switch (action.type) {
    case GET_HOUSE_LAYOUT_PATTERNS_SUCCESS:
      return action.resData.data.houseLayoutPatterns
    default:
      return state;
  }
};

