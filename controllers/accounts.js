'use strict';

import log from '../utils/log';
import config from '../config';
import utils from '../utils';
import { getPasswordString, hashPassword, comparePassword } from '../utils/bcrypt_async';
import { Users, UsersOmit, UsersPopulate, AuthCodes } from '../models';
import { verifyAuthCode } from '../middlewares/auth_codes';

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import MailCtrl from './mail';

const checkMobile = async (req, res) => {
  let body = req.body || {};
  let mobile = body.mobile;
  if (!utils.isMobileNumber(mobile)) {
    return res.handleResponse(400, {}, 'mobile format wrong');
  }
  let isExist = await Users.findOne({mobile: mobile}).exec();
  if (isExist) {
    return res.handleResponse(409, {}, 'mobile already exist');
  }
  return true;
}


const checkEmail = async (req, res) => {
  let body = req.body || {};
  let email = body.email;
  if (!utils.isEmail(email)) {
    return res.handleResponse(400, {}, 'email format wrong');
  }
  let isExist = await Users.findOne({email: email}).exec();
  if (isExist) {
    return res.handleResponse(409, {}, 'email already exist');
  }
  return true;
}

const checkPassword = async (req, res) => {
  try {
    var password = await hashPassword();
  } catch (err) {
    log.info(err.name, err.message);
    return res.handleResponse(400, {}, err.message);
  }
  return password;
}


/*
 * 使用手机号或密码创建用户
 * 客户端需要将plantext password作sha256处理，然后{algorithm: 'sha-256', digest: 'hash'}
 */
const createAccount = async (req, res) => {
  let body = req.body || {};
  let user = {}

  user.firstName = body.firstName;
  user.photo = body.photo;
  user.email = (body.email || '').trim();
  user.mobile = (body.mobile || '').trim();
  user.confirmed = false;
  user.confirmedMobile = false;
  user.confirmedEmail = false;
  user.available = true;
  let password = body.password

  if (!body.mobile && !body.email) {
    return res.handleResponse(400, {}, 'mobile or email is require');
  }
  if (!password) {
    return res.handleResponse(400, {}, 'password is require');
  }
  let check = false
  if(body.mobile) {
    check = await checkMobile(req, res);
    let verify = await verifyAuthCode(req, res, () => {});
    if (!verify) return;
    user.confirmed = true;
    user.confirmedMobile = true;
  } 
  if (body.email) {
    check = await checkEmail(req, res);
  } 
  if (!check) return;
  
  try {
    user.password = await hashPassword(password);
  } catch (err) {
    log.info(err.name, err.message);
    return res.handleResponse(500, {}, err.message);
  }
  try {
    user = await Users.create(user);
  } catch(err) {
    log.error(err.name, err.message);
    return res.handleResponse(500, {}, 'save account error');
  }
  let retUser = _.omit(user.toJSON(), UsersOmit);
  if (user.confirmed) {
    //生成token
    let token = jwt.sign({
      id: user._id
    }, config.jwt.jwtSecret, {
      expiresIn: config.jwt.jwtTimeout
    });
    return res.handleResponse(200, {token: token, user: retUser, expiresIn: config.jwt.jwtTimeout});
  } else {
    if (user.email) {
      try {
        await MailCtrl.sendConfirmMail(user);
      } catch(err) {
        log.error(err.name, err.message);
        return res.handleResponse(500, {}, 'send confirm mail error');
      }
    }
    return res.handleResponse(202, {user: retUser});
  }
  
};
exports.createAccount = createAccount;

/*
 * 验证邮箱
 */
const confirmEmail = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let token = query.token;
  if (!token) {
    return res.handleResponse(403, {});
  }
  try {
    var decoded = jwt.verify(token, config.jwtConfirm.jwtSecret);
  } catch (err) {
    return res.handleResponse(403, {});
  }
  if (decoded.type=='confirm' && decoded.id) {
    let user = await Users.findById(decoded.id).exec()
    if (!user) {
      return res.handleResponse(403, {});
    }
    user.confirmed = true 
    user.confirmedEmail = true;
    await user.save()
    return res.handleResponse(200, {});
  } else {
    return res.handleResponse(403, {});
  }

}
exports.confirmEmail = confirmEmail;

/*
 * 手机，验证码登陆
 */
const signinMobileWithAuthCode = async (req, res) => {
  let verify = await verifyAuthCode(req, res, () => {});
  if (!verify) return;

  let body = req.body || {};
  let mobile = body.mobile || '';
  mobile = mobile.toString().trim();
  if (!mobile) {
    return res.handleResponse(400, {}, 'mobile is require');
  }

  var user = await Users.findOne({mobile: mobile}).exec();
  if (!user) {
    return res.handleResponse(404, {});
  }
  if (!user.available) {
    return res.handleResponse(403, {}, 'not available');
  }

  try {
    if (!user.confirmedMobile) {
      user.confirmed = true;
      user.confirmedMobile = true;
    }
    user.loggedInAt = new Date();
    await user.save();
  } catch(err) {
    log.error(err.name, err.message);
    return res.handleResponse(500, {}, 'save user error');
  }

  //生成token
  let token = jwt.sign({
    id: user._id
  }, config.jwt.jwtSecret, {
    expiresIn: config.jwt.jwtTimeout
  });
  let retUser = _.omit(user.toJSON(), UsersOmit);
  return res.handleResponse(200, {token: token, user: retUser, expiresIn: config.jwt.jwtTimeout});
};
exports.signinMobileWithAuthCode = signinMobileWithAuthCode;


/*
 * 使用邮箱或手机，密码登陆
 */
var signinWithPwd = async (req, res) => {
  let body = req.body || {};
  log.info(body)
  let name = body.name || '';
  name = name.toString().trim();
  let password = body.password || '';
  // log.info(body)
  if (!name) {
    return res.handleResponse(400, {}, 'login name is require');
  }
  if (!password) {
    return res.handleResponse(400, {}, 'login password is require');
  }
  var user = null;
  try {
    if (utils.isMobileNumber(name)) {
      user = await Users.findOne({mobile: name}).exec();
      if (!user) {
        return res.handleResponse(404, {});
      }
      if (!user.confirmedMobile) {
        return res.handleResponse(403, {}, 'not confirmed');
      }
    } else if (utils.isEmail(name)) {
      user = await Users.findOne({email: name}).exec();
      if (!user) {
        return res.handleResponse(404, {});
      }
      if (!user.confirmedEmail) {
        return res.handleResponse(403, {}, 'not confirmed');
      }
    } else {
      return res.handleResponse(400, {}, 'login only support email or mobile');
    }  
  } catch(err) {
    log.error(err.name, err.message);
    return res.handleResponse(500, {});
  }
  
  if (!user) {
    return res.handleResponse(404, {});
  }
  if (!user.confirmed) {
    return res.handleResponse(403, {}, 'not confirmed');
  }
  if (!user.available) {
    return res.handleResponse(403, {}, 'not available');
  }
  //校验密码是否正确
  try {
    var result = await comparePassword(password, user.password);
  } catch(err) {
    log.error(err.name, err.message);
    result = null
  }
  if (result) {
    let token = jwt.sign({
      id: user._id
    }, config.jwt.jwtSecret, {
      expiresIn: config.jwt.jwtTimeout
    });
    let retUser = _.omit(user.toJSON(), UsersOmit);
    return res.handleResponse(200, {token: token, user: retUser, expiresIn: config.jwt.jwtTimeout});
  } else {
    return res.handleResponse(401, {}, 'incorrect password');
  }
};
exports.signinWithPwd = signinWithPwd;







