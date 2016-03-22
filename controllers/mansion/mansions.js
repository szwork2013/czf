'use strict';

import log from '../utils/log';
import _ from 'lodash';
import utils from '../utils';
import config from '../config';


import { Users, UsersOmit, UsersPopulate, Mansions, HouseLayouts } from '../models';


/*
 * 取得用户
 */
const ownMansions = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  let mansions = await Mansions.find({ownerId: user._id}).exec();
  // if (mansions && mansions.length>0) {
  //   for (mansion of mansions) {
  //     mansion.houseLayouts = await HouseLayouts.find({mansionsId: mansion._id}).exec();
  //     mansion.houses = await Houses.find({mansionsId: mansion._id}).populate({}).exec();
  //     mansion.
  //   }
  // }
  // return res.handleResponse(200, {user: retUser, token: token, expiresIn: config.jwt.jwtTimeout});
  return res.handleResponse(200, {mansions});
}
exports.getSelf = getSelf;


