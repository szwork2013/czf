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
  let user = req.user;
  let token = jwt.sign({
    id: user._id
  }, config.jwt.jwtSecret, {
    expiresIn: config.jwt.jwtTimeout
  });
  let retUser = _.omit(user.toJSON(), UsersOmit);
  // return res.handleResponse(200, {user: retUser, token: token, expiresIn: config.jwt.jwtTimeout});
  return res.handleResponse(500);
}
exports.refreshToken = refreshToken;









