'use strict';

import request from 'request';
import config from '../config';
let smsConfig = config.SMS;
import log from './log';

/**
 *
 * 错误码  错误描述    解决方案
 * -10  验证信息失败  检查api key是否和各种中心内的一致，调用传入是否正确
 * -20  短信余额不足  进入个人中心购买充值
 * -30  短信内容为空  检查调用传入参数：message
 * -31  短信内容存在敏感词   修改短信内容，更换词语
 * -32  短信内容缺少签名信息  短信内容末尾增加签名信息eg.【公司名称】
 * -40  错误的手机号  检查手机号是否正确
 * -41  号码在黑名单中 号码因频繁发送或其他原因暂停发送，请联系客服确认
 * -42  验证码类短信发送频率过快    前台增加60秒获取限制
 * -50  请求发送IP不在白名单内    查看触发短信IP白名单的设置
 */
let sendAuthCode = (mobile, message) => {
    log.debug('send sms:', mobile, message);
    if (mobile.substr(0,3) == '+86') {
        mobile = mobile.substr(3);
    }
    var postData = {
        mobile: mobile,
        message: message
    };

    var options = {
        url: smsConfig.domain + smsConfig.path,
        method: 'POST',
        auth: {
            user: 'api',
            pass: 'key-' + smsConfig.accessKey
        },
        form: postData
    };
    return new Promise(function (resolve, reject) {
        request(options, function (err, response, body) {
            if (err) {
                return reject(err);
            }
            return resolve(body);
        });
    });
}

exports.sendAuthCode = sendAuthCode;