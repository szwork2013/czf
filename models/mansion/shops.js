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
  floor: Number,                  //从0开始，0代表1楼
  room: Number,                   //从0开始，0代表01房
  area: {                         //面积
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  deleted: {
    type: Boolean,
    default: false
  },

  createdAt: {                //创建时间
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {              //最后修改时间
    type: Date,
    default: Date.now
  }
});
let Shops = mongoose.model('shops', ShopsModel);
exports.Shops = Shops;


