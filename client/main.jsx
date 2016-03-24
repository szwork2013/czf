'use strict';

import log from './utils/log'

import React, { Component }  from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

//router
import routes from './routers';

//store
import store from './store';

//history
const history = syncHistoryWithStore(browserHistory, store);

//html root DOM
const root = document.getElementById('root');


//react render
import MUIMaster from './containers/master/mui_master';
import APPMaster from './containers/master/app_master';
class Root extends Component {
  
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <MUIMaster>
          <APPMaster>
            <Router history={history} routes={routes} />
          </APPMaster>
        </MUIMaster>
      </Provider>
    );
  }
}

render(
  <Root store={store} history={history} />,
  root
);

//debug
import Perf from 'react-addons-perf';
window.Perf = Perf;
