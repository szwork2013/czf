'use strict';
/*
 * 房子户型
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



/*
 * 房子户型
 */
const HouseLayoutsSchema = new Schema({
  mansionId: {
    type: ObjectId,
    ref: 'mansions'
  },
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
  },
  deleted: {
    type: Boolean,
    default: false
  },
  order: Number
});
const HouseLayoutsModel = mongoose.model('house_layouts', HouseLayoutsSchema);

exports.HouseLayouts = HouseLayoutsModel;

/*
 * 初始化
 */
exports.initHouseLayouts = async (clean) => {
  if (clean) {
    if (process.env.NODE_ENV === 'test') {
      await HouseLayoutsModel.remove().exec()
    }
  }
  let houseLayout = await HouseLayoutsModel.findOne().exec()
  if (houseLayout) {
    return;
  }
  log.info("mongo -- init HouseLayouts");
  for (houseLayout of houseLayouts) {
    await HouseLayoutsModel.create(houseLayout);
  }
}

/*
 * 初始化数据
 */
let houseLayouts = [{
    description: '单房暗',
    bedroom: '1', livingroom: '0', brightness: '0',
    defaultDeposit: 300,
    defaultRental: 300,
    defaultSubscription: 150,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 1,
  }, {
    description: '单房亮',
    bedroom: '1', livingroom: '0', brightness: '10',
    defaultDeposit: 350,
    defaultRental: 350,
    defaultSubscription: 250,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 2,
  }, {
    description: '一房一厅暗',
    bedroom: '1', livingroom: '1', brightness: '0',
    defaultDeposit: 500,
    defaultRental: 500,
    defaultSubscription: 250,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 3,
  }, {
    description: '一房一厅亮',
    bedroom: '1', livingroom: '1', brightness: '10',
    defaultDeposit: 600,
    defaultRental: 600,
    defaultSubscription: 300,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 4,
  }, {
    description: '两房一厅暗',
    bedroom: '2', livingroom: '1', brightness: '0',
    defaultDeposit: 750,
    defaultRental: 750,
    defaultSubscription: 350,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 5,
  }, {
    description: '两房一厅亮',
    bedroom: '2', livingroom: '1', brightness: '10',
    defaultDeposit: 900,
    defaultRental: 900,
    defaultSubscription: 450,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 6,
  }, {
    description: '三房一厅暗',
    bedroom: '3', livingroom: '1', brightness: '0',
    defaultDeposit: 1050,
    defaultRental: 1050,
    defaultSubscription: 550,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 7,
  }, {
    description: '三房一厅亮',
    bedroom: '3', livingroom: '1', brightness: '10',
    defaultDeposit: 1200,
    defaultRental: 1200,
    defaultSubscription: 600,
    servicesCharges: 20,
    overdueFine: 20,
    deleted: false,
    order: 8,
  }
];
exports.defaultHouseLayouts = houseLayouts;


