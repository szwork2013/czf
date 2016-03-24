'use strict';
/*
 * 记录房子信息
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const HousesSchema = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  floor: Number,                  //从1开始，1代表1楼
  room: Number,                   //从1开始，1代表01房
  houseLayout: {
    type: ObjectId,
    ref: 'house_layouts'
  },
  area: {                         //面积
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  tenantId: {                       //租客信息
    type: ObjectId,
    ref: 'tenant'
  },
  subscriberId: {                   //订客信息
    type: ObjectId,
    ref: 'subscriber'
  },
  electricMeterEndNumber: Number,  //电表
  waterMeterEndNumber: Number,     //水表
  remark: String                   //备注
});
const HousesModel = mongoose.model('houses', HousesSchema);
exports.Houses = HousesModel;



// /*
//  * 租房信息
//  */
// const TenantModel = new Schema({
//   name: String,
//   mobile: String,
//   idNo: String,
//   deposit: Number,            //押金
//   rental: Number,             //租金
//   rentalStartDate: Date,      //本次租金开始日期，闭区间
//   rentalEndDate: Date,        //本次租金有效日期，开区间
//   oweRental: Number,              //欠租金
//   oweRentalExpiredDate: Number,   //欠租金补交最迟时间，开区间
//   doorCardCount: Number,      //门卡数
//   currentRentUntil: Date,     //当前交租月份
//   contractStartDate: Date,    //合同开始
//   contractEndDate: Date,      //合同结束日期
//   createdAt: Date,            //交租时间
// }, {
//   _id: false
// });

// /*
//  * 订房信息
//  */
// const SubscriberModel = new Schema({
//   name: String,
//   mobile: String,
//   idNo: String,
//   subscription: Number,     //订金
//   expiredDate: Date           //过期日期
//   createdAt: {              //下定时间
//     type: Date,
//     default: Date.now
//   },
// }, {
//   _id: false
// });
