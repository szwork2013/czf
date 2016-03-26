'use strict';
import log from '../utils/log';
import utils from '../utils';
import { Mansions } from '../models'
import _ from 'lodash'

var mansionVerify = async (req, res, next) => {
  let body = !_.isEmpty(req.body) ? req.body : req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  var mansionId = body.mansionId || '';
  mansionId = mansionId.toString().trim();
  if (!user) {
    res.handleResponse(403, {});
    return false;
  }
  if (!mansionId) {
    res.handleResponse(400, {}, 'mansionId is required');
    return false;
  }

  var have = false;
  try {
    have = await Mansions.findOne({_id: mansionId, deleted: false, '$or': [{ownerId: user._id}, {managerIds: user._id}]}).exec();
  } catch (err) {
    log.error(err.name, err.message)
    have = null;
  }
  if (!have) {
    res.handleResponse(403, {}, 'mansionId not allow');
    return false;
  }
  req.mansion = have;
  next();

}

exports.mansionVerify = mansionVerify;