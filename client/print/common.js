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

var getNumberChinese = (value) => {
  var value = value===undefined || value===null ? 0: value
  value = isNaN(Number(value))? 0: Number(value)
  return value
}
exports.getNumberChinese = getNumberChinese;

var getRoom = (floor='', room='', floorDesLength = 1, roomDesLength = 2, floorDesPrefix = '') => {
  return floorDesPrefix + utils.pad(floor, floorDesLength) + utils.pad(room, roomDesLength)
}
exports.getRoom = getRoom





