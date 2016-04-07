'use strict';
/*
 * 记录房卡信息
 */

import log from '../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * 房卡信息
 */
const DoorCardsModel = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  housesId: {
    type: ObjectId,
    ref: 'houses'
  },
  floor: Number,                  //从0开始，0代表1楼
  room: Number,                   //从0开始，0代表01房

  name: String,
  mobile: String,
  idNo: String,

  count: Number,                //个数
  charges: Number,              //单价
  type: {                       //类型，sell为销售，recover为回购
    type: String,
    enum: ['sell', 'recover'],
    default: 'sell'
  },
  total: Number,                //收费情况，如果为sell，则为正数，recover为负数

  createdAt: {                  //购买或回购时间
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: ObjectId,
    ref: 'users'
  },
  lastUpdatedAt: {              //最后修改时间
    type: Date,
    default: Date.now
  }
});


let DoorCards = mongoose.model('door_cards', DoorCardsModel);
exports.DoorCards = DoorCards;
