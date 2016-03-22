'use strict';

import React from 'react';
import { Router, Route, IndexRoute, NotFoundRoute } from 'react-router';
import SignIn from './containers/signin';
import Desktop from './containers/desktop/desktop';
import DashBoard from './containers/dashboard'
import Profile from './containers/profile'
import NoFound from './containers/no_found'

import store from './store'

console.log(NotFoundRoute)

function requireAuth(nextState, replace) {
  let state = store.getState() || {};
  let user = state.user;
  if (user && user.token && user.expiresIn && user.expiresIn > new Date()) {
    return;
  } else {
    replace('/signin');
  }
}

function autoSignin(nextState, replace) {
  let state = store.getState() || {};
  let user = state.user;
  if (user && user.token && user.expiresIn && user.expiresIn > new Date()) {
    replace('/');
  } else {
    return;
  }
}

const routes = (
  <Router>
    <Route onEnter={autoSignin} path="signin" component={SignIn} />
    <Route onEnter={requireAuth} path="/" component={Desktop} >
      <IndexRoute component={DashBoard} />
      <Route path='dashboard' component={DashBoard} />
      <Route path='profile' component={Profile} />
    </Route>
    <Route path="*" component={NoFound}/>
  </Router>
);

export default routes;
