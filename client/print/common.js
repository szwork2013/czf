'use strict';

import log from '../utils/log'
import utils from '../utils'
import moment from 'moment'

var getValue = (value) => {
  var value = value===undefined || value===null ? '': value
  if (value instanceof Date)
    return new moment(value).format('YYYY年MM月DD日')
  return value.toString()
}
exports.getValue = getValue;


/** 数字金额大写转换(可以处理整数,小数,负数) */   
function padding(l, c=' ') {
  var zArray = []
  for (var i=0; i<l; i++) zArray.push(c)
  return zArray.join('')
} 
var getNumberChinese = (n, minLength=6, paddingLength=0, sufixWithYuan=false) => {
  var n = n===undefined || n===null ? 0: n
  n = isNaN(Number(n))? 0: Number(n)
  n = n<0? -n: n

  var unit = '千百拾亿千百拾万千百拾元角', str = '';
  n += '0';
  var p = n.indexOf('.');
  if (p >= 0) n = n.substring(0, p) + n.substr(p+1, 1);
  n = padding(minLength-n.length, '0')+n

  unit = unit.substr(unit.length-n.length);

  var paddingStr = padding(paddingLength, ' ')
  for (var i=0; i < n.length; i++) 
    str += paddingStr + ('零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i));
  
  if (sufixWithYuan)
    return str.replace(/零角$/g, "整");
  return str
}
exports.getNumberChinese = getNumberChinese;



var getRoom = (floor='', room='', floorDesLength = 1, roomDesLength = 2, floorDesPrefix = '') => {
  return floorDesPrefix + utils.pad(floor, floorDesLength) + utils.pad(room, roomDesLength)
}
exports.getRoom = getRoom





