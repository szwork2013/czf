'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import config from '../../config';


import { Users, UsersOmit, UsersPopulate, Mansions, HouseLayouts, Houses, Shops } from '../../models';


/*
 * 取得所有资产，包括所有和管理
 */
const mansionsAll = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  let mansions = await Mansions.find({'$or': [{ownerId: user._id}, {managerIds: user._id}]}).exec();
  return res.handleResponse(200, {mansions});
}
exports.mansionsAll = mansionsAll;


/*
 * 取得单个资产的出租房、出租房户型、商铺信息
 */
const mansionInfo = async (req, res) => {
  try{
    let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
    var mansionId = query.mansionId;

    // var houseLayouts = null
    // if (query.houseLayouts) {
    //   houseLayouts = await HouseLayouts.find({mansionId: mansionId}).sort({order: 1}).exec()
    // }

    let pupulateStr = ''
    var houses = null;
    if (query.tenant) {
      pupulateStr += 'tenantId '
    }
    if (query.subscriber) {
      pupulateStr += 'subscriberId '
    }
    
    if (query.houses) {
      houses = await Houses.find({mansionId: mansionId}).populate(pupulateStr).exec()
    }

    var shops = null;
    if (query.shops) {
      shops = await Shops.find({mansionId: mansionId}).exec()
    }
    return res.handleResponse(200, {mansionId, houses, shops});
  }catch(err) {
    log.error(err.name, erro.message)
    return res.handleResponse(500, {});
  }
}
exports.mansionInfo = mansionInfo;


