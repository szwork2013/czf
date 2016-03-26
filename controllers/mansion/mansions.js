'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import config from '../../config';


import { Users, UsersOmit, UsersPopulate, Mansions, HouseLayouts, defaultHouseLayouts, Houses, Shops } from '../../models';


/*
 * 取得所有资产，包括所有和管理
 */
const mansionsAll = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  let mansions = await Mansions.find({available: true, '$or': [{ownerId: user._id}, {managerIds: user._id}]}).exec();
  return res.handleResponse(200, {mansions});
}
exports.mansionsAll = mansionsAll;


/*
 * 取得单个资产的出租房、出租房户型、商铺信息
 */
const mansionInfo = async (req, res) => {
  try{
    let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
    var mansionId = query.mansionId;

    var houseLayouts = null
    if (query.houseLayouts) {
      houseLayouts = await HouseLayouts.find({mansionId: mansionId}).sort({order: 1}).exec()
    }

    let pupulateStr = ''
    var houses = null;
    if (query.tenant) {
      pupulateStr += 'tenantId '
    }
    if (query.subscriber) {
      pupulateStr += 'subscriberId '
    }
    
    if (query.houses) {
      houses = await Houses.find({mansionId: mansionId}).populate(pupulateStr).exec()
    }

    var shops = null;
    if (query.shops) {
      shops = await Shops.find({mansionId: mansionId}).exec()
    }
    return res.handleResponse(200, {mansionId, houseLayouts, houses, shops});
  }catch(err) {
    log.error(err.name, erro.message)
    return res.handleResponse(500, {});
  }
}
exports.mansionInfo = mansionInfo;

/*
 * 新建单位
 */
const addMansion = async (req, res) => {
  try{
    let body = req.body || {};
    let user = req.user;
    var name = body.name;
    if (!name) {
      return res.handleResponse(400, {}, 'name is require');
    }
    let mansion = await Mansions.create({name, ownerId: user._id});
    return res.handleResponse(200, mansion);
  }catch(err) {
    log.error(err.name, erro.message)
    return res.handleResponse(500, {});
  }
}
exports.addMansion = addMansion;

/*
 * 删除单位
 */
const deleteMansion = async (req, res) => {
  try{
    let body = req.body || {};
    let user = req.user;
    var mansionId = body.mansionId;
    if (!mansionId) {
      return res.handleResponse(400, {}, 'mansionId is require');
    }
    await Mansions.update({_id: mansionId, ownerId: user._id, available: true}, {'$set': {available:false}});
    return res.handleResponse(200, {id: mansionId});
  }catch(err) {
    log.error(err.name, erro.message)
    return res.handleResponse(500, {});
  }
}
exports.deleteMansion = deleteMansion;



import { loadRentFile } from '../../old/old_record'
/*
 * 导入旧版本历史数据
 */
const importHistoryVersionData = async (req, res) => {
  try{
    var body = req.body || {};
    var user = req.user
    var mansionId = body.mansionId;
    if (!mansionId) {
      return res.handleResponse(400, {}, 'mansionId is require');
    }
    var mansion = await Mansions.findOne({_id: mansionId, ownerId: user._id, available: true}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var file = req.file;
    if (!file) {
      return res.handleResponse(400, {}, 'file is require');
    }
    var hisObj = await loadRentFile(req.file.path);
    if (_.isEmpty(hisObj)) {
      return res.handleResponse(400, {}, 'file is broken');
    }
    //更新旧的出租信息和
    var houseLayouts = mansion.houseLayouts = _.cloneDeep(defaultHouseLayouts);
    //门卡
    mansion.doorCardSellCharges = hisObj.doorCardSellCharges;
    mansion.doorCardRecoverCharges = hisObj.doorCardRecoverCharges;
    //出租房电水费
    mansion.houseElectricChargesPerKWh = hisObj.houseElectricChargesPerKWh
    mansion.houseElectricChargesMinimalKWhs = 1
    mansion.houseWaterChargesPerTon = hisObj.houseWaterChargesPerTon
    mansion.houseWaterChargesMinimalTons = 1
    //管理费
    mansion.housePropertyMaintenanceChargesType = 0
    houseLayouts[0].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth0
    houseLayouts[1].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth0
    houseLayouts[2].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth1
    houseLayouts[3].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth1
    houseLayouts[4].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth2
    houseLayouts[5].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth2
    houseLayouts[6].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth3
    houseLayouts[7].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth3
    //逾期罚款
    mansion.houseOverdueFineType = 0
    houseLayouts[0].overdueFine = hisObj.houseOverdueFineForLayoutPerDay0
    houseLayouts[1].overdueFine = hisObj.houseOverdueFineForLayoutPerDay0
    houseLayouts[2].overdueFine = hisObj.houseOverdueFineForLayoutPerDay1
    houseLayouts[3].overdueFine = hisObj.houseOverdueFineForLayoutPerDay1
    houseLayouts[4].overdueFine = hisObj.houseOverdueFineForLayoutPerDay2
    houseLayouts[5].overdueFine = hisObj.houseOverdueFineForLayoutPerDay2
    houseLayouts[6].overdueFine = hisObj.houseOverdueFineForLayoutPerDay3
    houseLayouts[7].overdueFine = hisObj.houseOverdueFineForLayoutPerDay3
    //楼层数
    mansion.floorCount = 0;
    mansion.housesCount = [];
    mansion.housesAvailableCount = []
    //出租房
    var houses = []

    return res.handleResponse(200, {});
  }catch(err) {
    log.error(err.name, err.message)
    return res.handleResponse(500, {});
  }
}
exports.importHistoryVersionData = importHistoryVersionData;











