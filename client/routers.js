'use strict';

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import SignIn from './containers/signin';
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
    <Route path="/" component={SignIn} />
    <Route onEnter={isSignin} path="/signin" component={SignIn} />
  </Router>
);

export default routes;
