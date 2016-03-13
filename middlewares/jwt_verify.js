'use strict';

const log = require('../utils/log').default;
import jwt from 'jsonwebtoken';
import config from '../config';
let jwtConfig = config.jwt;

import { Users } from '../models'

var jwtVerify = async (req, res, next) => {
  let token = req.get('authorization');
  if (!token) {
    return res.handleResponse(401, {});
  }

  //校验token
  var decoded = {};
  try {
    decoded = jwt.verify(token, jwtConfig.jwtSecret);
  } catch (err) {
    log.info(err.name, err.message);
    return res.handleResponse(401, {});
  }
  if (!decoded || !decoded.id) {
    return res.handleResponse(401, {});
  }
  //较验userId
  let user = await Users.findById(decoded.id).exec()
  if (!user) {
    return res.handleResponse(401, {}, 'user not found');
  }
  if (!user.confirmed) {
    return res.handleResponse(403, {}, 'not confirmed');
  }
  if (!user.available) {
    return res.handleResponse(403, {}, 'not available');
  }
  req.userId = decoded.id;
  req.user = user;
  next();
};
exports.jwtVerify = jwtVerify;
