'use strict';
import log from '../utils/log';
import utils from '../utils';
import { AuthCodes } from '../models'

var verifyAuthCode = async (req, res, next) => {
  let body = req.body || {};
  var mobile = body.mobile || '',
  mobile = mobile.toString().trim();
  var code = body.code || '',
  code = code.toString().trim();
  if (!mobile) {
    res.handleResponse(400, {}, 'mobile is required');
    return false;
  }
  if (!code) {
    res.handleResponse(400, {}, 'code is required');
    return false;
  }
  if (!utils.isMobileNumber(mobile)) {
    res.handleResponse(400, {}, 'mobile format wrong');
    return false;
  }
  var have = false;
  try {
    have = await AuthCodes.findOne({mobile: mobile}).sort({expire: -1}).exec();
  } catch (err) {
    have = null;
  }
  if (!have || have.code !== code) {
    res.handleResponse(401, {}, 'auth code wrong');
    return false;
  }
  try {
    await AuthCodes.remove({mobile: mobile}).exec();
  } catch (err) {
    log.error(err);
  }
  next();
  return true;
}

exports.verifyAuthCode = verifyAuthCode;