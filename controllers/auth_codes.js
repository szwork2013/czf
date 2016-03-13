'use strict';

import log from '../utils/log';
import config from '../config';
import utils from '../utils';
import { AuthCodes } from '../models';

let smsConfig = config.SMS;
import SMS from '../utils/sms';

/*
 * 生成验证码
 */
var generateAuthCode = async (req, res) => {
  var SMS_TEMPLATE = '验证码：${code}，${expiry}分钟内有效。请勿将此验证码发给任何号码及其他人。【czf】';
  let body = req.body || {};
  if (!body.mobile) {
    return res.handleResponse(400, {}, 'mobile is required');
  }
  if (!utils.isMobileNumber(body.mobile)) {
    return res.handleResponse(400, {}, 'mobile format wrong');
  }
  //限制同一手机号，在config.SMS_MIN_INTERVAL_SECONDS秒内只能发送一次
  var have = null;
  try {
    have = await AuthCodes.findOne({mobile: body.mobile}).sort({expire: -1}).exec();
    if (have && (have.expire.getTime() + smsConfig.minIntervalSeconds*1000 < Date.now())) {
      have = null;
    }
  } catch (err) {
    have = null;
  }
  if (have) {
    return res.handleResponse(429, {}, 'limit auth code generate rate');
  }
  //特殊手机号
  if (body.mobile === "13710248411" || body.mobile==='13710000000' || body.mobile==='13711111111' || 
          body.mobile==='13712222222') {
    log.info('catch test mobile:', +body.mobile)
    var code = "123456"
    var message = SMS_TEMPLATE.replace('${code}', code).replace('${expiry}', smsConfig.expiryMinutes);
    var newCode = {
      mobile: body.mobile,
      code: code,
      msg: message
    };
    await AuthCodes.create(newCode);
    return res.handleResponse(200);
  }
  //确保同一手机号不会发送相同的验证码
  var message = '';
  try {
    do {
      var code = utils.genRandomCode(6);
      var codes = await AuthCodes.find({mobile: body.mobile, code: code}).exec();
      if (codes.length === 0) {
        message = SMS_TEMPLATE.replace('${code}', code).replace('${expiry}', smsConfig.expiryMinutes)
        var newCode = {
          mobile: body.mobile,
          code: code,
          msg: message
        };
        await AuthCodes.create(newCode);
      }
    } while (message === '');
  } catch (err) {
    log.error(err.name, err.message);
    return res.handleResponse(500, {}, 'generate auth code fail');
  }
  //发送验证码
  var result = null;
  try {
      result = await SMS.sendAuthCode(body.mobile, message);
      result = JSON.parse(result);
  } catch (err) {
      await AuthCodes.remove({mobile: body.mobile, code: code}).exec();
      log.error(err.name, err.message);
      return res.handleResponse(502, {}, 'send auth code fail');
  }
  if (result && result['error'] == 0 ) {
      return res.handleResponse(200);
  } else {
      log.error('SMS.sendAuthCode(body.mobile, message) error code :', result['error']);
      await AuthCodes.remove({mobile: body.mobile, code: code}).exec();
      return res.handleResponse(502, {code: result['error']}, 'send auth code fail');
  }
};
exports.generateAuthCode = generateAuthCode;


