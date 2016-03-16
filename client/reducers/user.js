'use strict';

import { SAVE_USER_TO_REDUX } from '../constants/actionTypes';
import { Storage } from '../utils/storage'; 

let user = Storage.get('user', 'object') || {}
let token = Storage.get('token') || ''

const initialState = {
  user,
  token
};

export default function signin(state=initialState, action) {
  switch (action.type) {
    case SAVE_USER_TO_REDUX:
      let newState = Object.assign({}, state)
      if (action.user) newState.user = action.user
      if (action.token) newState.token = action.token
      return newState;
    default:
      return state;
  }
};

