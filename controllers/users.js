'use strict';

import log from '../utils/log';
import jwt from 'jsonwebtoken';
import config from '../config'

import { Users, UsersTypes, UsersOmit, UsersPopulate, AuthCodes } from '../../models';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import utils from '../utils';
import SMS from '../utils/sms';

import { verifyAuthCode } from '../middlewares/auth_codes'

/*
 * 注册用户
 */
const register = async (req, res) => {
  let body = req.body || {};
  let user = {}
  let firstName = user.firstName = body.firstName;
  let photo = user.photo = body.photo;
  let mobile = user.mobile = body.mobile;
  let email = user.email = body.email;

}









