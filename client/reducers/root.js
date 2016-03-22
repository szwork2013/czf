'use strict';

import { combineReducers } from 'redux';
// import { routerStateReducer as router } from 'redux-router';
import { routerReducer as routing } from 'react-router-redux';
import {APP_STATE, appState} from './master/app_state';
import mui from './master/mui';
import loading from './master/loading';
import toast from './master/toast';

import sideBar from './side_bar'
import menus from './menus'

import user from './user';
import { signin } from './sign';

//mansion
import houseLayoutPatterns from './mansion/house_layout_patterns'

const rootReducer = combineReducers({
  //add other reducer here,
  [APP_STATE]: appState,
  mui,
  sideBar,
  menus,
  routing,
  loading,
  toast,
  user,
  signin,

  houseLayoutPatterns,
});

export default rootReducer;

