'use strict';
/*
 * 记录每栋大厦信息
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * 房子户型
 */
const HouseLayoutsSchema = new Schema({
  description: String,
  // patterns: Object,
  bedroom: String,
  livingroom: String,
  kitchen: String,
  washroom: String,
  balcony: String,
  brightness: String,
  defaultDeposit: {       //默认押金
    type: Number,
    default: 0
  },
  defaultRental: {       //默认租金
    type: Number,
    default: 0
  },
  defaultSubscription: {  //默认定金
    type: Number,
    default: 0
  },
  servicesCharges: {
    type: Number,
    default: 0,
  },
  overdueFine: {
    type: Number,
    default: 0
  }
}, {_id: false});

/*
 * 大厦
 */
const MansionsSchema = new Schema({
  name: String,
  invoiceTitle: String,                       //单据与发票抬头
  //地理位置
  province: String,
  city: String,
  area: String,
  address: String,

  //房子
  floorCount: Number,                       //楼层数
  housesCount: [Number],                    //数组下标从0开始，0代表1层的总房子数
  housesAvailableCount: [Number],            
  shopsCount: [Number],                     //0代表1层的总商铺数
  shopsAvailableCount: [Number],
  floorDesPrefix: {                         //楼层显示前缀
    type: String,
    default: ''
  },
  floorDesLength: {                         //楼层显示长度，不包含prefix，默认为1，当为9楼时，显示为9，当为10楼时，显示为10
    type: Number,
    default: 1
  },
  housesDesLength: {                        //房间显示长度，默认为2，当为9房时，显示为09，当为10房时，显示为10
    type: Number,
    default: 2
  },
  shopsDesLength: {
    type: Number,
    default: 2
  },

  //
  houseLayouts: [HouseLayoutsSchema],
  //物业费
  housePropertyMaintenanceChargesType: {    //房子物业费收取方式
    type: Number,
    enum: [0, 1],                           //0按户型收，1按单位面积收
    default: 0
  },
  houseServicesChargesPerUnit: Number,      //房子单位面积物业费
  // houseServicesChargesForLayoutPerMonth: Object,    //房子各个户型物业费
  houseServicesChargesDes: String,          //房子物业费描述：路灯，电梯，卫生

  //逾期罚款
  houseOverdueFineType: {                   //房子逾期罚款收取方式
    type: Number,
    enum: [0, 1],                           //0按户型收，1按单位面积收
    default: 0
  },
  houseOverdueFinePerUnitPerDay: Number,    //房子单位面积逾期每天每平方费用
  // houseOverdueFineForLayoutPerDay: Object,  //房子各个户型逾期每天费用
  houseOverdueFineDes: String,
  //电水费
  houseWaterChargesPerTon: Number,           //房子单位水费
  houseWaterChargesMinimalTons: {            //房子每月最低用水量
    type: Number,
    default: 1
  },
  houseElectricChargesPerKWh: Number,        //房子单位电费
  houseElectricChargesMinimalKWhs: {         //房子每水最小用电量
    type: Number,
    default: 1
  },
  //门卡
  doorCardSellCharges: Number,         //房子门卡单价
  doorCardRecoverCharges: Number,      //房子门卡回收单价
  //订金
  houseSubscriptionValidityUnit: {                 //订金有效期限单位
    type: String,
    enum: ['day', 'month', 'year'],
    default: 'day'
  },
  houseSubscriptionValidityCount: Number,          //订金有效期限

  //商铺
  shopPropertyMaintenanceChargesType: {       //商铺物业费收取方式
    type: Number,
    enum: [1],                                //1按单位面积收
    default: 1
  },
  //管理费
  shopPropertyMaintenanceChargesPerUnit: Number,              //商铺单位面积管理费
  shopPropertyMaintenanceChargesDes: String,                  //商铺管理费描述：路灯，电梯，卫生
  //逾期交租罚款
  shopOverdueFinePerUnitPerDay: Number,                       //商铺单位面积逾期每天每平方费用
  //水电费
  shopWaterChargesPerTon: Number,             //商铺单位水费
  shopWaterChargesMinimalTons: {              //商铺每月最低用水量
    type: Number,
    default: 1
  },
  shopElectricChargesPerKWh: Number,          //商铺单位电费
  shopElectricChargesMinimalKWhs: {           //商铺每水最小用电量
    type: Number,
    default: 1
  },
  //订金
  shopSubscriptionValidityUnit: {                 //订金有效期限单位
    type: String,
    enum: ['day', 'month', 'year'],
    default: 'day'
  },
  shopSubscriptionValidityCount: Number,          //订金有效期限

  ownerId: {                //所有者
    type: ObjectId,
    ref: 'users'
  },
  // adminIds: {               //超级管理员
  //   type: ObjectId,
  //   ref: 'users'
  // },
  managerIds: [ObjectId],   //管理员
  createdAt: {              //创建时间
    type: Date,
    default: Date.now
  }
});
let MansionsModel = mongoose.model('mansions', MansionsSchema);
exports.Mansions = MansionsModel;

/*
 * 初始化
 */
exports.initMansions = async (clean) => {
  if (clean) {
    if (process.env.NODE_ENV === 'test') {
      await MansionsModel.remove().exec()
    }
  }
  let mansion = await MansionsModel.findOne().exec()
  if (mansion) {
    return;
  }
  log.info("mongo -- init Mansions");
  for (mansion of mansions) {
    await MansionsModel.create(mansion);
  }
};

let mansions = [{
  name: '财富大厦',
  invoiceTitle: '深圳市美佳财富物业管理处',
  province: '广东',
  city: '深圳',
  area: '宝安区',
  address: '龙华新区观澜',
  floorCount: 16,
  //       1  2   3   4   5   6
  // floors: [0, 27, 27, 27, 27, 69],
  housePropertyMaintenanceChargesType: 0,     //房子物业费，0按户型收，1按单位面积收
  houseServicesChargesForLayoutPerMonth: {},
  houseServicesChargesDes: '路灯，电梯，卫生',
  houseOverdueFineType: 0,                    //房子逾期交租罚款，0按户型收，1按单位面积收
  houseOverdueFineForLayoutPerDay: {},
  houseOverdueFineDes: '逾期交租罚款',
  //电水费
  houseWaterChargesPerTon: 5.5,            //房子单位水费
  houseElectricChargesPerKWh: 1.2,         //房子单位电费
  //门卡
  doorCardSellCharges: 20,           //房子门卡单价
  doorCardRecoverCharges: 15,        //房子门卡回收单价
  //订金
  houseSubscriptionValidityUnit: 'day',            //订金有效期限单位
  houseSubscriptionValidityCount: 15,            //订金有效期限
  houseLayouts: [{
    description: '单房暗',
    bedroom: '1', livingroom: '0', brightness: '0',
    defaultDeposit: 300,
    defaultRental: 300,
    defaultSubscription: 150,
    order: 1,
  }, {
    description: '单房亮',
    bedroom: '1', livingroom: '0', brightness: '10',
    defaultDeposit: 350,
    defaultRental: 350,
    defaultSubscription: 250,
    order: 2,
  }, {
    description: '一房一厅暗',
    bedroom: '1', livingroom: '1', brightness: '0',
    defaultDeposit: 500,
    defaultRental: 500,
    defaultSubscription: 250,
    order: 3,
  }, {
    description: '一房一厅亮',
    bedroom: '1', livingroom: '1', brightness: '10',
    defaultDeposit: 600,
    defaultRental: 600,
    defaultSubscription: 300,
    order: 4,
  }, {
    description: '两房一厅暗',
    bedroom: '2', livingroom: '1', brightness: '0',
    defaultDeposit: 750,
    defaultRental: 750,
    defaultSubscription: 350,
    order: 5,
  }, {
    description: '两房一厅亮',
    bedroom: '2', livingroom: '1', brightness: '10',
    defaultDeposit: 900,
    defaultRental: 900,
    defaultSubscription: 450,
    order: 6,
  }, {
    description: '三房一厅暗',
    bedroom: '3', livingroom: '1', brightness: '0',
    defaultDeposit: 1050,
    defaultRental: 1050,
    defaultSubscription: 550,
    order: 7,
  }, {
    description: '三房一厅亮',
    bedroom: '3', livingroom: '1', brightness: '10',
    defaultDeposit: 1200,
    defaultRental: 1200,
    defaultSubscription: 600,
    order: 8,
  }]
}];












