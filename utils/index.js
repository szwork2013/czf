'use strict';

/**
 * 判断手机号码格式
 * @function
 * @param {string} mobile - 手机号码
 */
exports.isMobileNumber = function isMobileNumber(mobileNumber) {
  var re = /^1\d{10}$/;
  return re.test(mobileNumber);
}

/**
 * 判断是否邮箱格式
 * @function
 * @param {string} email - 邮箱.
 */
exports.isEmail = function isEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


exports.pad = function pad(num, len=0) {
  var str = num.toString();
  var zero = ''
  for (var i = str.length; i<len; i++) {
    zero += '0'
  };
  return zero+str;
}

/*
 * 取得随机数
 */
exports.genRandomCode = function genRandomCode(len=18) {
  var code = '';
  var number = '0123456789';
  for (var i = 0; i < len; i++) {
    code += number.charAt(Math.floor(Math.random() * number.length));
  }
  return code;
}

/**
 * 获取分页的条件[sort, page, limit]
 * @function
 * @param {Object} options
 */
exports.getPaginateCond = function(options) {
  options = options || {};
  var opt = {};
  options.sort = options.sort || '-createdAt';
  opt.sort = {};
  if (options.sort.indexOf('-')==0) {
      opt.sort[options.sort.slice(1)] = -1;
  } else {
      opt.sort[options.sort] = 1;
  }
  opt.page = options.page || 1;
  opt.limit = options.limit || 10;
  return opt;
}

require('./playground')

exports.parseDate = function(dateStr) {
  var retDate = new Date(dateStr)
  if ( Object.prototype.toString.call(retDate) !== "[object Date]" )
    return null
  if (isNaN(retDate.getTime()))
    return null
  return retDate
}
