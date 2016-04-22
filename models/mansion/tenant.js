'use strict';
/*
 * 记录出租信息
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// /*
//  * 租金总计
//  */
// const TenantSummedModel = new Schema({
//   subscription: Number,                 //订金
//   deposit: Number,                    //押金
//   rental: Number,                     //租金
//   waterCharges: Number,               //水费
//   electricCharges: Number,            //电费
//   servicesCharges: Number,            //物业费
//   compensation: Number,               //损坏赔偿
//   total: Number                       //总计
// });

/*
 * 出租信息
 */
const TenantModel = new Schema({
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
  type: {                         //交租类型，in新入住，out退房，rental租金，migrate导入数据迁移
    type: String,
    enum: ['in', 'out', 'rental']
  },
  name: String,
  mobile: String,
  idNo: String,

  subscription: Number,         //订金，作充抵用
  subscriberId: {
    type: ObjectId,
    ref: 'subscriber'
  },

  deposit: Number,                //押金
  rental: Number,                 //租金
  oweRental: Number,              //欠租金
  oweRentalRepay: Number,         //补欠租金
  oweRentalExpiredDate: Date,     //欠租金补交最迟时间，开区间

  rentalStartDate: Date,      //本次租金开始日期，闭区间
  rentalEndDate: Date,        //本次租金有效日期，开区间
  contractStartDate: Date,    //合同开始
  contractEndDate: Date,      //合同结束日期

  electricMeterEndNumber: Number,     //电表
  electricChargesPerKWh: Number,      //房子单位电费
  electricKWhs: Number,               //用电度数
  electricCharges: Number,            //电费

  waterMeterEndNumber: Number,        //水表
  waterChargesPerTon: Number,         //房子单位水费
  waterTons: Number,                  //用水吨数
  waterCharges: Number,               //水费   

  doorCardCount: Number,              //购买门卡数
  doorCardCharges: Number,            //购买门卡总价，累计
  doorCardRecoverCount: Number,       //回收门卡个数
  doorCardRecoverCharges: Number,     //回收门卡总价

  servicesCharges: Number,          //物业费
  compensation: Number,             //损坏赔偿

  overdueFinePerDay: Number,          //逾期罚款/每天
  overdueDays: Number,                //逾期天数
  overdueCharges: Number,             //逾期罚款
  
  summed: Number,                     //费用总计

  remark: String,                   //备注
  createdAt: {                      //交租时间
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

let Tenant = mongoose.model('tenant', TenantModel);
exports.Tenant = Tenant;
