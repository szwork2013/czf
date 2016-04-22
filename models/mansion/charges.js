'use strict';
/*
 * 所有收费信息
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
 * 收费信息总汇，用于报表和单据打印
 */
const ChargesModel = new Schema({
  mansionId: {                    
    type: ObjectId,
    ref: 'mansions'
  },
  houseId: {
    type: ObjectId,
    ref: 'houses'
  },
  tenantId: {
    type: ObjectId,
    ref: 'tenant'
  },
  floor: Number,                  //从0开始，0代表1楼
  room: Number,                   //从0开始，0代表01房
  type: {                         //类型，in新入住，out退房，rental租金，migrate导入数据迁移
    type: String,
    enum: ['checkin', 'subscribe', 'rental', 'migrate']
  },

  subscription: Number,               //定金
  deposit: Number,                    //押金
  rental: Number,                     //租金
  oweRental: Number,                  //欠租金
  oweRentalRepay: Number,             //补欠租金
  waterCharges: Number,               //水费
  electricCharges: Number,            //电费
  servicesCharges: Number,            //物业费
  doorCardCharges: Number,            //门卡费

  summed: Number,                     //总计

  remark: String,                  //备注
  createdAt: {                    //时间
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: ObjectId,
    ref: 'users'
  }
});


let Charges = mongoose.model('charges', ChargesModel);
exports.Charges = Charges;
