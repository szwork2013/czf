'use strict';
/*
 * 记录商店信息信息
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const ShopsModel = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  floor: Number,
  room: String,
  area: {                         //面积
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  }
});
let Shops = mongoose.model('shops', ShopsModel);
exports.Shops = Shops;


