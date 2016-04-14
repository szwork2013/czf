'use strict';
/*
 * 记录欠租金与补交信息
 */

import log from '../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * 欠租金与补交信息
 */
const OweRentalModel = new Schema({
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

  rental: Number,                 //补租金
  oweRental: Number,              //欠租金
  oweRentalExpiredDate: Number,   //欠租金补交最迟时间，开区间

  rentalStartDate: Date,      //本次租金开始日期，闭区间
  rentalEndDate: Date,        //本次租金有效日期，开区间

               
  createdAt: {                //
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: ObjectId,
    ref: 'users'
  }
});

let OweRental = mongoose.model('owe_rental', OweRentalModel);
exports.OweRental = OweRental;
