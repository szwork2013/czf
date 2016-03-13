'use strict';
/*
 * 记录出租信息
 */

import log from '../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * 租金总计
 */
const TenantSummedModel = new Schema({
  subscriber: Number,                 //订金
  deposit: Number,                    //押金
  rental: Number,                     //租金
  waterCharges: Number,               //水费
  electricCharges: Number,            //电费
  propertyMaintenanceCharges: Number, //物业费
  compensation: Number,               //损坏赔偿
  total: Number                       //总计
});

/*
 * 出租信息
 */
const TenantModel = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  housesId: {
    type: ObjectId,
    ref: 'houses'
  },
  floor: Number,                  //从1开始，1代表1楼
  room: Number,                   //从1开始，1代表01房
  type: {                         //交租类型，in新入住，out退房，rental租金
    type: String,
    enum: ['in', 'out', 'rental']
  },
  name: String,
  mobile: String,
  idNo: String,

  subscriber: Number,         //订金，如果有，为负数，作充抵用
  subscriberId: {
    type: ObjectId,
    ref: 'subscriber'
  },
  deposit: Number,            //押金
  rental: Number,             //租金
  rentalStartDate: Date,      //本次租金开始日期，闭区间
  rentalEndDate: Date,        //本次租金有效日期，开区间
  oweRental: Number,              //欠租金
  oweRentalExpiredDate: Number,   //欠租金补交最迟时间，开区间
  doorCardCount: Number,      //持有门卡数
  contractStartDate: Date,    //合同开始
  contractEndDate: Date,      //合同结束日期
  waterChargesPerTon: Number,           //房子单位水费
  electricChargesPerKWh: Number,        //房子单位电费
  waterTons: Number,          //用水吨数
  electricKWhs: Number,       //用电度数
  summed: TenantSummedModel,
  createdAt: {                    //交租时间
    type: Date,
    default: Date.now
  },
  createBy: {
    type: ObjectId,
    ref: 'users'
  }
});

let Tenant = mongoose.model('tenant', TenantModel);
exports.Tenant = Tenant;
