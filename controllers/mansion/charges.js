'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import config from '../../config';

import nodeExcel from 'excel-export'

import { Users, UsersOmit, Mansions, HouseLayouts, defaultHouseLayouts, 
        Houses, Tenant, Subscriber, Shops, Charges } from '../../models';

import moment from 'moment';

/*
 * 定房
 */
const getCharges = async (req, res) => {
  try{
    let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
    var user = req.user
    var mansionId = query.mansionId;
    var mansion = await Mansions.findOne({_id: mansionId, deleted: false, '$or': [{ownerId: user._id}, {'managers.userId': user._id}]}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var beginDate = utils.parseDate(query.beginDate) || new moment().startOf('day').toDate()
    var endDate = utils.parseDate(query.endDate) || new moment().endOf('day').toDate()
    var diffDate = (new moment(endDate)).diff(beginDate, 'year', true)
    if (diffDate<0) {
      return res.handleResponse(400, {msg: 'endDate must large than beginDate'});
    }
    if (diffDate>1) {
      return res.handleResponse(400, {msg: 'endDate and beginDate must between one year'});
    }

    var cond = {mansionId, createdAt: {$gte: beginDate, $lte: endDate}}
    var category = query.category
    switch (category) {
      case 'house':
      case 'shop':
        cond.category = category
        break;
    }
    var type = query.type
    switch (type) {
      case 'subscribe':
      case 'unsubscribe':
      case 'checkin':
      case 'repay':
      case 'rental':
      case 'checkout':
      case 'doorcard':
        cond.type = type
      break;
    }
    // log.info(cond)
    var charges = await Charges.find(cond).exec()
    return res.handleResponse(200, {mansionId, beginDate, endDate, charges});

  }  catch(err) {
    log.error(err.name, err.message)
    return res.handleResponse(500, {});
  }
}
exports.getCharges = getCharges;

