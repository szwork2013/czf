'use strict';
/*
 * 手机验证码
 */

import log from '../utils/log'
import config from '../config';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let smsConfig = config.SMS;

const AuthCodes = new Schema({
    mobile: String,
    code: String,
    expire: {
        type: Date,
        default: Date.now,
        expires: smsConfig.expiryMinutes*60
    }
});

// AuthCodesSchema.pre('save', function (next) {
// });

const AuthCodesModel = mongoose.model('authcodes', AuthCodes);
exports.AuthCodes = AuthCodesModel;
