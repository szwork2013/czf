'use strict';

import log from '../utils/log';
import config from '../config';
import utils from '../utils';
import { Mail, Users, UsersOmit, UsersPopulate } from '../models';

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import moment from 'moment';
import MailUtil from '../utils/mail';
const transporter = MailUtil.transporter;

/*
 * 取第一优先级的mail
 */
const getFirstMail = async () => {
  let cond = {counter: {$lt: config.mailRetryMaxCount+1}, expiry: {$gt: new Date()}}
  try {
    var mail = await Mail.findOne(cond).sort({expiry: -1, level: -1}).exec(); 
  } catch (err) {
    log.error(err.name, err.message);
    mail = null;
  }
  return mail;
}

const sendMailAsync = async (mail) => {
  if (mail) {
    log.trace('send mail to ', mail.fields.to);
    try {
      await MailUtil.send(mail.fields);
      await Mail.remove({_id: mail._id});
      log.trace('send mail to ', mail.fields.to, ' finished');
    } catch (err) {
      log.error(err.name, err.message)
      log.error(err)
      try {
        await Mail.update({_id: mail._id}, {$set: {counter: mail.counter+1}})
      } catch(err) {
        log.error(err.name, err.message)
      }
    }
  }
}

const sendMailWhenIdel = async () => {
  if(transporter.isIdle()) {
    let mail = await getFirstMail()
    if (mail) {
      await sendMailAsync(mail);
    }
  }
}

var transporting = false;
transporter.on('idle', async () => {
  if (transporting) return;
  transporting = true
  do {
    let mail = await getFirstMail();
    await sendMailAsync(mail);
  }while(transporter.isIdle() && mail);
  transporting = false;
});

/*
 * 生成激活邮件
 */
const buildConfirmMail = (user) => {
  //生成token
  let token = jwt.sign({
    type: 'confirm',
    id: user._id
  }, config.jwtConfirm.jwtSecret, {
    expiresIn: config.confirmMailExpiryMinutes * 60
  });
  let html = `<div style={position:relative;font-size:14px;height:auto;padding:15px 15px 10px 15px;z-index:1;zoom:1;line-height:1.7;}>
    <p>尊敬的${config.name}用户<strong>${user.firstName?user.firstName:''}</strong>： </p>
    <div style="margin-left:30px;">
        <p>您好！</p>
        <p>请点击如下链接来完成帐号验证。</p>
        <p><a href="${config.domain}/api/v1/mail/confirm?token=${token}" target="_blank">${config.domain}/api/v1/mail/confirm?token=${token}</a></p>
        <p>如果上面的链接无法点击，您也可以复制链接，粘贴到您浏览器的地址栏内，然后按“回车”键打开预设页面，完成相应功能。</p>
        <p>验证将会在${config.confirmMailExpiryMinutes}分钟后失效，请尽快完成身份验证，否则需要重新进行验证。</p>
        <p>如果有其他问题，请联系我们：<a href="mailto:qz050236@126.com" target="_blank">qz050236@126<wbr>.com</a> 谢谢！</p>
    </div>
    <p>此为系统消息，请勿回复</p>
  </div>`
  let mailInfo = {
    from: `"${config.name}安全中心" <${config.nodemailer.auth.user}>`,
    // from: config.nodemailer.auth.user,
    to: user.email,
    subject: `验证登录邮箱【${config.name}安全中心】`,
    html: html
  }
  return mailInfo;
}
/*
 * 发送激活邮件
 */
const sendConfirmMail = async (user) => {
  if (!user) return;
  let mailInfo = buildConfirmMail(user)
  let mail = {
    fields: mailInfo,
    level: 5,
    expiry: moment().add(30, 'minutes'),
    counter: 0
  }
  await Mail.create(mail);
  sendMailWhenIdel()
}
exports.sendConfirmMail = sendConfirmMail;

// sendMailWhenIdel()










