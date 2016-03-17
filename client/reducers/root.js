'use strict';

import { combineReducers } from 'redux';
// import { routerStateReducer as router } from 'redux-router';
import { routerReducer as routing } from 'react-router-redux';
import {APP_STATE, appState} from './master/app_state';
import mui from './mui';
import user from './user';
import loading from './loading';
import toast from './toast';
import { signin } from './sign';


const rootReducer = combineReducers({
  //add other reducer here,
  [APP_STATE]: appState,
  mui,
  user,
  routing,
  loading,
  toast,
  signin
});

export default rootReducer;

