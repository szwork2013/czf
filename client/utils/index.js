'use strict';

const positiveNumberReg = /^[0-9]*[.]*[0-9]*$/
exports.isPositiveNumber = function isPositiveNumber(str) {
  return positiveNumberReg.test(str)
}

const numberReg = /^[\-]?[0-9]*[.]*[0-9]*$/
exports.isNumber = function isNumber(str) {
  return numberReg.test(str)
}

/**
 * 判断手机号码格式
 * @function
 * @param {string} mobile - 手机号码
 */
const mobileReg = /^1\d{10}$/;
exports.isMobileNumber = function isMobileNumber(mobileNumber) {
  return mobileReg.test(mobileNumber);
}

/**
 * 判断验证码格式
 * @function
 * @param {string} mobile - 手机号码
 */
exports.isAuthCode = function isAuthCode(authCode) {
  var re = /^\d{6}$/;
  return re.test(authCode);
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

var GENDER_MAP = {
  'F': '女',
  'f': '女',
  'M': '男',
  'm': '男'
}
exports.decodeGender = function decodeGender(gender) {
  return GENDER_MAP[gender] || ''
}


exports.parseDate = function parseDate(dateStr) {
  var retDate = new Date(dateStr)
  if ( Object.prototype.toString.call(retDate) !== "[object Date]" )
    return null
  if (isNaN(retDate.getTime()))
    return null
  return retDate
}







