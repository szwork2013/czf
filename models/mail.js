'use strict';
/*
 * 邮箱
 */

import log from '../utils/log'
import config from '../config';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const MailFields = new Schema({
  from: String,
  to: String,
  cc: String,
  bcc: String,
  subject: String,
  text: String,
  html: String,
  attachments: Object,
  envelope: String,
  headers: String
})

const Mail = new Schema({
  fields: MailFields,
  type: {
    type: String,
    enum: ['confirm']
  },
  level: Number,        //紧急度，越大越紧急
  expiry: Date,         //邮件失效时间
  counter: {            //发送失败计数器
    type: Number,
    default: 0
  }
});

// AuthCodesSchema.pre('save', function (next) {
// });

const MailModel = mongoose.model('mail', Mail);
exports.Mail = MailModel;
