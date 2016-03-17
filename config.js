'use strict'
import _ from 'lodash'


var config = {
    // for app description
    name: 'CZF',
    version: '1.0.0',
    domain: 'http://localhost:'+(process.env.PORT || 6500),
    port: process.env.PORT || 6500,

    // for database
    database: {
        host: '127.0.0.1',
        user: '',
        password: '',
        port: '27017',
        db: 'czf'
    },

    jwt: {
        // for jwt secret(JSON Web Tokens)
        jwtSecret: '',
        jwtTimeout: 60 * 60 * 24 * 10
    },

    jwtConfirm: {
        // for jwt secret(JSON Web Tokens)
        jwtSecret: '',
        jwtTimeout: 60 * 30
    },

    // AWS, qiniu
    CDN: {
        name: '',
        domain: '', // 要带上 http://
        uploadDomain: '',
        bucket: '',
        accessKey: '',
        secretKey: ''
    },

    SMS: {
        domain: '',
        path: '',
        accessKey: '',
        minIntervalSeconds: 60,   //同一个手机号短信发送最短间格
        expiryMinutes: 5           //验证码有效时长，单位分钟
    },
    verificatioCodeIntervalSeconds: 60 * 5,

    nodemailer: {
        pool: true,
        host: '',
        port: 25,
        secure: false,
        requireTLS: true,
        auth: {
            user: '',
            pass: ''
        },
        // connectionTimeout: 6000,
        // greetingTimeout: 6000,
        // socketTimeout: 6000
    },
    mailRetryMaxCount: 100,
    confirmMailExpiryMinutes: 30    //激活邮件有效时长，单位分钟 

};

try {
    var relConfig = require('./config_e.js');
    _.assign(config, relConfig);
} catch (e) {
}


module.exports = config;