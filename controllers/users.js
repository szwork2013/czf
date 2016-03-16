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
const getSelf = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  let token = jwt.sign({
    id: user._id
  }, config.jwtConfirm.jwtSecret, {
    expiresIn: config.jwtConfirm.jwtTimeout
  });
  let retUser = _.omit(user.toJSON(), UsersOmit);
  return res.handleResponse(200, {user: retUser, token: token, expiresIn: config.jwtConfirm.jwtTimeout});
}
exports.getSelf = getSelf;









