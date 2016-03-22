'use strict';
/*
 * 记录用户数据
 * admin代表系统管理员，manager代表房屋管理员
 */

import log from '../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 

const UsersSchema = new Schema({
  firstName: String,        //姓名
  photo: String,            //头相
  mobile: {
    type: String,           //手机号码，例如13800138000
    index: { index: true }
  },
  email: {
    type: String,            //邮箱
    index: { index: true }
  },
  password: String,         //密码，参见meteor account密码加密方式
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmedMobile: {
    type: Boolean,
    default: false
  },
  confirmedEmail: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },  
  createdAt: {              //创建时间
    type: Date,
    default: Date.now
  },
  loggedInAt: {             //最后登录时间
    type: Date,
    default: Date.now
  },
});
exports.UsersOmit = ['password'];
exports.UsersPopulate = 'password';

let UsersModel = mongoose.model('users', UsersSchema);
exports.Users = UsersModel;

exports.initUsers = async (clean) => {
  if (clean) {
    await UsersModel.remove().exec()
  }
  let user = await UsersModel.findOne().exec()
  if (user) {
    return;
  }
  log.info("mongo -- init users");
  for (user of users) {
    await UsersModel.create(user);
  }
}

let users = [{
    firstName: '黄Admin',
    photo: '',
    mobile: '',
    email: '546113328@qq.com',
    password: '$2a$10$pYrktkKuIloTFDTNAbEeDuwNQSZRMptNm7JL.hv/yVmKqqd2dynL2',
    confirmed: true,
    confirmedEmail: true,
    available: true,
  }, {
    firstName: '黄Manager',
    photo: '',
    mobile: '',
    email: '372057124@qq.com',
    password: '$2a$10$KdkBHS7U7CCWgC2Q.2VXSeJmvj6CPs3IE3.tynSe2rOxhJI3MYNqm',
    confirmed: true,
    confirmedEmail: true,
    available: true,
  },
];