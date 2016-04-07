'use strict';
/*
 * 房子户型特征
 */

import log from '../../utils/log'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const HouseLayoutPatternsItemSchema = new Schema({
    description: String,
    code: String,
  }, {
    _id: false
  }
)

/*
 * 房子户型
 */
const HouseLayoutPatternsSchema = new Schema({
  description: String,
  code: String,
  items: [HouseLayoutPatternsItemSchema],
  lastUpdatedAt: {              //最后修改时间
    type: Date,
    default: Date.now
  }
});
const HouseLayoutPatternsModel = mongoose.model('house_layout_patterns', HouseLayoutPatternsSchema);

exports.HouseLayoutPatterns = HouseLayoutPatternsModel;

/*
 * 初始化
 */
exports.initHouseLayoutPatterns = async (clean) => {
  if (clean) {
    if (process.env.NODE_ENV === 'test') {
      await HouseLayoutPatterns.remove().exec()
    }
  }
  let houseLayoutPattern = await HouseLayoutPatternsModel.findOne().exec()
  if (houseLayoutPattern) {
    return;
  }
  log.info("mongo -- init HouseLayoutPatterns");
  for (houseLayoutPattern of houseLayoutPatterns) {
    await HouseLayoutPatternsModel.create(houseLayoutPattern);
  }
}

/*
 * 初始化数据
 */
let houseLayoutPatterns = [{
    code: 'bedroom',
    description: '房间',
    items: [{
      code: '1',
      description: '一房'
    }, {
      code: '2',
      description: '两房'
    }, {
      code: '3',
      description: '三房'
    }, {
      code: '4',
      description: '四房'
    }]
  }, {
    code: 'livingroom',
    description: '客厅',
    items: [{
      code: '0',
      description: '单间'
    }, {
      code: '1',
      description: '一厅'
    }, {
      code: '2',
      description: '两厅'
    }]
  }, {
    code: 'kitchen',
    description: '厨房',
    items: [{
      code: '0',
      description: '无厨房'
    }, {
      code: '1',
      description: '一厨'
    }]
  }, {
    code: 'washroom',
    description: '卫生间',
    items: [{
      code: '0',
      description: '无卫生间'
    }, {
      code: '1',
      description: '一卫'
    }]
  }, {
    code: 'balcony',
    description: '阳台',
    items: [{
      code: '0',
      description: '无阳台'
    }, {
      code: '1',
      description: '一阳台'
    }]
  }, {
    code: 'brightness',
    description: '光线',
    items: [{
      code: '0',
      description: '暗'
    }, {
      code: '10',
      description: '亮'
    }]
  }
];

