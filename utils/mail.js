'use strict';

import nodemailer from 'nodemailer';
import _ from 'lodash';

import config from '../config';
let mailConfig = config.nodemailer;
import log from './log';

// https://www.npmjs.com/package/nodemailer#using-well-known-services
var transporter = null;
if (!transporter) {
  transporter = nodemailer.createTransport(mailConfig);
}
exports.transporter = transporter;

const verify = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}
exports.verify = verify;
 
const send = (data) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve()
      }
    })
  })
}
exports.send = send;


