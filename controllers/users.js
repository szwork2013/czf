'use strict';

import log from '../utils/log';
import jwt from 'jsonwebtoken';
import config from '../config'

import { Users, UsersTypes, UsersOmit, UsersPopulate, AuthCodes } from '../models';
import _ from 'lodash';
import utils from '../utils';



/*
 * 取得用户
 */
const refreshToken = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = query.user;
  let token = jwt.sign({
    id: user._id
  }, config.jwt.jwtSecret, {
    expiresIn: config.jwt.jwtTimeout
  });
  let retUser = _.omit(user.toJSON(), UsersOmit);
  return res.handleResponse(200, {user: retUser, token: token, expiresIn: config.jwt.jwtTimeout});
  // return res.handleResponse(500);
}
exports.refreshToken = refreshToken;


/*
 * 取得用户
 */
const getUser = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  var user = null;
  if (query.id) {
    user = await Users.findOne({_id: query.id, confirmed: true, available: true})
  } else if (query.mobile) {
    user = await Users.findOne({mobile: query.mobile, confirmed: true, confirmedMobile: true, available: true})
  } else if (query.email) {
    user = await Users.findOne({email: query.email, confirmed: true, confirmedEmail: true, available: true})
  }
  if (user) {
    res.handleResponse(200, {user: _.omit(user.toJSON(), UsersOmit)});
  } else {
    res.handleResponse(404, {}, 'user not found');
  }
}
exports.getUser = getUser;










