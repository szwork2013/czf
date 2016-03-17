'use strict';

import log from './utils/log'

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import rootReducer from './reducers/root';
import api from './middleware/api';

var showReduxLogger = true;
//store
var composeCreateStore = showReduxLogger? 
  compose(applyMiddleware(thunk, api, reduxLogger()))(createStore): 
  compose(applyMiddleware(thunk, api))(createStore);
const store = composeCreateStore(rootReducer);
// const store = createStore(rootReducer)

export default store;

