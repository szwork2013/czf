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
  <Route path="/" >
    <Route onEnter={isSignin} path="signin" component={SignIn} />
  </Route>
);

export default routes;
