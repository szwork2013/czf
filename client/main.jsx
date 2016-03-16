'use strict';

import log from './utils/log'

import React, { Component }  from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import rootReducer from './reducers/root';
import api from './middleware/api';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routers';

import MUIMaster from './containers/mui_master'


var showReduxLogger = true;
//store
var composeCreateStore = showReduxLogger? compose(applyMiddleware(thunk, api, reduxLogger()))(createStore): compose(applyMiddleware(thunk, api))(createStore);
const store = composeCreateStore(rootReducer);
// const store = createStore(rootReducer)

//history
const history = syncHistoryWithStore(browserHistory, store);

//html root DOM
const root = document.getElementById('root');

//react render
class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <MUIMaster>
          <Router history={history} routes={routes} />
        </MUIMaster>
      </Provider>
    );
  }
}

//css
require('./styles/loading.css');


render(
  <Root store={store} history={history} />,
  root
);
