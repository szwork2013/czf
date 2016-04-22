'use strict';
/*
 * 记录订房信息
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * 订房信息
 */
const SubscriberModel = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  houseId: {
    type: ObjectId,
    ref: 'houses'
  },
  floor: Number,                  //从0开始，0代表1楼
  room: Number,                   //从0开始，0代表01房

  name: String,
  mobile: String,
  idNo: String,
  subscription: Number,           //订金
  expiredDate: Date,              //过期日期
  status: {                       //状态，valid有效状态，transfer为入住转移到押金，expired过期订金不退，
                                  //default我方违约，需要赔偿，migrate导入数据迁移
    type: String,
    enum: ['valid', 'unsubscribe', 'transfer', 'expired'],
    default: 'valid'
  },
  refund: Number,                  //退定金

  remark: String,                  //备注
  createdAt: {                    //下定时间
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


let Subscriber = mongoose.model('subscriber', SubscriberModel);
exports.Subscriber = Subscriber;
