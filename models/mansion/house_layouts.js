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
  mansionsId: {
    type: ObjectId,
    ref: 'mansions'
  },
  description: String,
  patterns: Object,
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
  order: Number,
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
    patterns: {bedroom: '1', livingroom: '0', brightness: '0'},
    defaultDeposit: 300,
    defaultRental: 300,
    defaultSubscription: 150,
    order: 1,
  }, {
    description: '单房亮',
    patterns: {bedroom: '1', livingroom: '0', brightness: '10'},
    defaultDeposit: 350,
    defaultRental: 350,
    defaultSubscription: 250,
    order: 2,
  }, {
    description: '一房一厅暗',
    patterns: {bedroom: '1', livingroom: '1', brightness: '0'},
    defaultDeposit: 500,
    defaultRental: 500,
    defaultSubscription: 250,
    order: 3,
  }, {
    description: '一房一厅亮',
    patterns: {bedroom: '1', livingroom: '1', brightness: '10'},
    defaultDeposit: 600,
    defaultRental: 600,
    defaultSubscription: 300,
    order: 4,
  }, {
    description: '两房一厅暗',
    patterns: {bedroom: '2', livingroom: '1', brightness: '0'},
    defaultDeposit: 750,
    defaultRental: 750,
    defaultSubscription: 350,
    order: 5,
  }, {
    description: '两房一厅亮',
    patterns: {bedroom: '2', livingroom: '1', brightness: '10'},
    defaultDeposit: 900,
    defaultRental: 900,
    defaultSubscription: 450,
    order: 6,
  }, {
    description: '三房一厅暗',
    patterns: {bedroom: '3', livingroom: '1', brightness: '0'},
    defaultDeposit: 1050,
    defaultRental: 1050,
    defaultSubscription: 550,
    order: 7,
  }, {
    description: '三房一厅亮',
    patterns: {bedroom: '3', livingroom: '1', brightness: '10'},
    defaultDeposit: 1200,
    defaultRental: 1200,
    defaultSubscription: 600,
    order: 8,
  }
];

