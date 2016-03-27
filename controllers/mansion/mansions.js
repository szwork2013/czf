'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import config from '../../config';


import { Users, UsersOmit, UsersPopulate, Mansions, HouseLayouts, defaultHouseLayouts, 
        Houses, Tenant, Subscriber, Shops } from '../../models';

import moment from 'moment';

/*
 * 取得所有资产，包括所有和管理
 */
const mansionsAll = async (req, res) => {
  let query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
  let user = req.user;
  let mansions = await Mansions.find({deleted: false, '$or': [{ownerId: user._id}, {managerIds: user._id}]}).exec();
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
      houseLayouts = await HouseLayouts.find({mansionId: mansionId, deleted: false}).sort({order: 1}).exec()
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
      houses = await Houses.find({mansionId: mansionId, deleted: false}).populate(pupulateStr).exec()
    }

    var shops = null;
    if (query.shops) {
      shops = await Shops.find({mansionId: mansionId, deleted: false}).exec()
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
    await Mansions.update({_id: mansionId, ownerId: user._id, deleted: false}, {'$set': {deleted:true}});
    return res.handleResponse(200, {id: mansionId});
  }catch(err) {
    log.error(err.name, erro.message)
    return res.handleResponse(500, {});
  }
}
exports.deleteMansion = deleteMansion;



import { loadRentFile } from '../../old/old_record'
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
const insertBatch = (model, docs) => {
  return new Promise((resolve, reject) => {
    model.collection.insert(docs, (err, newDocs) => {
      if (err) reject(err);
      resolve(newDocs)
    });
  })
}
/*
 * 导入旧版本历史数据
 */
const importHistoryVersionData = async (req, res) => {
  try{
    var body = req.body || {};
    var user = req.user
    var mansionId = body.mansionId;
    var mansionObjectId = new ObjectId(mansionId);
    if (!mansionId) {
      return res.handleResponse(400, {}, 'mansionId is require');
    }
    var mansion = await Mansions.findOne({_id: mansionId, ownerId: user._id, deleted: false}).exec();
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
    //迁移旧的出租信息和订房
    var oldHouses = await Houses.find({mansionId: mansionId}).exec()
    // var oldTenant = {}
    var oldHouse = {}
    for (oldHouse of oldHouses) {
      // log.info(i, oldHouse)
      // oldHouse = oldHouse[i]
      //有租客，需要将租户的信息转入tenant表
      if (oldHouse.tenantId) {
        await Tenant.update({_id: oldHouse.tenantId}, {$set: {type: 'migrate'}}).exec()
      }
      if (oldHouse.subscriberId) {
        await Subscriber.update({_id: oldHouse.subscriberId}, {$set: {type: 'migrate'}}).exec()
      }
    }
    await Houses.update({mansionId: mansionId, deleted: false}, {$set: {deleted: true}}, {multi: true}).exec();
    //更新旧户型
    await HouseLayouts.update({mansionId: mansionId, deleted: false}, {$set: {deleted: true}}, {multi: true}).exec();

    //插入新户型
    var houseLayouts = _.cloneDeep(defaultHouseLayouts);
    houseLayouts.forEach((houseLayout) => {houseLayout.mansionId = mansionObjectId})
    //管理费
    houseLayouts[0].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth0
    houseLayouts[1].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth0
    houseLayouts[2].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth1
    houseLayouts[3].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth1
    houseLayouts[4].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth2
    houseLayouts[5].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth2
    houseLayouts[6].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth3
    houseLayouts[7].servicesCharges = hisObj.houseServicesChargesForLayoutPerMonth3
    //逾期罚款
    
    houseLayouts[0].overdueFine = hisObj.houseOverdueFineForLayoutPerDay0
    houseLayouts[1].overdueFine = hisObj.houseOverdueFineForLayoutPerDay0
    houseLayouts[2].overdueFine = hisObj.houseOverdueFineForLayoutPerDay1
    houseLayouts[3].overdueFine = hisObj.houseOverdueFineForLayoutPerDay1
    houseLayouts[4].overdueFine = hisObj.houseOverdueFineForLayoutPerDay2
    houseLayouts[5].overdueFine = hisObj.houseOverdueFineForLayoutPerDay2
    houseLayouts[6].overdueFine = hisObj.houseOverdueFineForLayoutPerDay3
    houseLayouts[7].overdueFine = hisObj.houseOverdueFineForLayoutPerDay3
    houseLayouts = await insertBatch(HouseLayouts, houseLayouts);
    houseLayouts = houseLayouts.ops

    mansion.housePropertyMaintenanceChargesType = 0
    mansion.houseOverdueFineType = 0
    //门卡
    mansion.doorCardSellCharges = hisObj.doorCardSellCharges;
    mansion.doorCardRecoverCharges = hisObj.doorCardRecoverCharges;
    //出租房电水费
    mansion.houseElectricChargesPerKWh = hisObj.houseElectricChargesPerKWh
    mansion.houseElectricChargesMinimalKWhs = 1
    mansion.houseWaterChargesPerTon = hisObj.houseWaterChargesPerTon
    mansion.houseWaterChargesMinimalTons = 1

    //楼层数
    mansion.floorCount = 0;
    mansion.housesCount = [];
    mansion.housesExistCount = []
    //出租房
    var floorCount = 0
    var housesCount = []
    var housesExistCount = []
    var newHouses = []
    var newHouse = []
    var newTenant = {}
    var newSubscriber = {}

    var floor = []
    var house = {}
    var tenant = {}
    var subscriber = null


    for (var floorIdx=0;  floorIdx< hisObj.floor.length; floorIdx++) {
      floor = hisObj.floor[floorIdx]
      for (var houseIdx=0; houseIdx<floor.houseCount; houseIdx++) {
        house = floor[houseIdx]
        
        newHouse = {}
        newHouse.mansionId = mansionObjectId;
        newHouse.floor = floorIdx;
        newHouse.room = houseIdx;
        newHouse.isExist = house.isExist;
        newHouse.deleted = false;
        newHouse = await Houses.create(newHouse);

        if(house.isExist) {
          floorCount = floorIdx+1;
          newHouse.houseLayout = houseLayouts[house.roomNum*2 + Number(house.brightness)]._id;
          newHouse.electricMeterEndNumber = house.electricMeterEndNumber
          newHouse.waterMeterEndNumber = house.waterMeterEndNumber
          newHouse.remark = house.remark;
          
          if (!_.isEmpty(house.tenant)) {
            tenant = house.tenant
            newTenant = {}
            newTenant.mansionId = mansionId;
            newTenant.houseId = newHouse._id;
            newTenant.floor = floorIdx;
            newTenant.room = houseIdx;
            newTenant.type = 'migrate';
            newTenant.name = tenant.name;
            newTenant.mobile = tenant.mobile;
            newTenant.idNo = tenant.idNo;
            newTenant.deposit = tenant.deposit;
            newTenant.rental = tenant.rental;
            newTenant.oweRental = tenant.oweRental || tenant.ownDeposit;

            newTenant.oweRentalExpiredDate = tenant.oweRentalExpiredDate;
            newTenant.doorCardCount = tenant.doorCardCount;
            newTenant.contractStartDate = tenant.contractStartDate;
            newTenant.contractEndDate = tenant.contractEndDate;
            newTenant.rentalEndDate = tenant.rentalEndDate;

            newTenant.rentalStartDate = moment(tenant.rentalEndDate).add(-1, 'month').toDate()
            newTenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
            newTenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh
            newTenant.waterTons = 0
            newTenant.electricKWhs = 0
            newTenant.summed = {}

            newTenant.createdAt = new Date()
            newTenant.createdBy = user._id;
            newTenant = await Tenant.create(newTenant)
            newHouse.tenantId = newTenant._id;
          }
          if (!_.isEmpty(house.subscriber)) {
            subscriber = house.subscriber
            newSubscriber = {}
            newSubscriber.mansionId = mansionObjectId;
            newSubscriber.houseId = newHouse._id;
            newSubscriber.floor = floorIdx;
            newSubscriber.room = houseIdx;
            newSubscriber.status = 'migrate';
            newSubscriber.name = subscriber.name;
            newSubscriber.mobile = subscriber.mobile;
            newSubscriber.idNo = subscriber.idNo;
            newSubscriber.subscription = subscriber.subscription
            newSubscriber.createdAt = subscriber.createdAt
            newSubscriber.expiredDate = subscriber.expiredDate
            newSubscriber.createdBy = new Date()
            newSubscriber = await Subscriber.create(newSubscriber)
            newHouse.subscriberId = newSubscriber._id;
          }
          await newHouse.save()
        }
      }
    }
    mansion.floorCount = floorCount;
    for (var i=0; i<floorCount; i++) {
      housesCount.push(hisObj.floor[i].houseCount)
      housesExistCount.push(hisObj.floor[i].existsHouseCount)
    }
    mansion.housesCount = housesCount
    mansion.housesExistCount = housesExistCount;
    await mansion.save()
    return res.handleResponse(200, mansion);
  }catch(err) {
    log.error(err.name, err.message)
    return res.handleResponse(500, {});
  }
}
exports.importHistoryVersionData = importHistoryVersionData;











