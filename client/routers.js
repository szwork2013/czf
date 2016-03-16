'use strict';

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import SignIn from './containers/signin';
import Desktop from './containers/desktop';
import DashBoard from './containers/dashboard'
import { Session } from './utils/session';

function requireAuth(nextState, replace) {
  if (!Session.get('token')) {
    replace('/signin');
  }
}

function isSignin(nextState, replace) {
  if (Session.get('token')) {
    replace('/');
  }
}


const routes = (
  <Router>
    <Route onEnter={isSignin} path="signin" component={SignIn} />
    <Route onEnter={requireAuth} path="/" component={Desktop} >
      <IndexRoute component={DashBoard} />
    </Route>
  </Router>
);

export default routes;
