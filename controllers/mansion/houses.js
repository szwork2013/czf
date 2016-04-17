'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import IDCard from '../../utils/identitycard'
import config from '../../config';



import { Users, UsersOmit, Mansions, HouseLayouts, defaultHouseLayouts, 
        Houses, Tenant, Subscriber, Shops } from '../../models';

import moment from 'moment';

/*
 * 新入住
 */
const houseCheckIn = async (req, res) => {
  // var pickArray = ['remark']
  try{
    var body = req.body || {};
    var newHouse = body.house
    var newTenant = newHouse.tenantId
    // log.info(newHouse.tenantId)
    var mansionId = newHouse.mansionId
    var user = req.user;
    var mansion = await Mansions.findOne({_id: mansionId, '$or': [{ownerId: user._id}, {'managers.userId': user._id}], deleted: false}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var house = await Houses.findOne({_id: newHouse._id, isExist: true, deleted: false}).exec();
    if (!house) {
      return res.handleResponse(400, {}, 'house not found');
    }
    if (house.lastUpdatedAt.getTime() !==  (new Date(newHouse.lastUpdatedAt)).getTime()) {
      return res.handleResponse(409, {}, 'old data');
    }
    if (house.tenantId) {
      return res.handleResponse(400, {}, 'house has tenant');
    }

    var tenant = {}
    tenant.name = newTenant.name
    tenant.mobile = newTenant.mobile
    tenant.idNo = newTenant.idNo || ''
    tenant.remark = newTenant.remark || ''
    if (!tenant.name) return res.handleResponse(400, {}, 'name is require');
    if (!tenant.mobile) return res.handleResponse(400, {}, 'mobile is require');
    if (!utils.isMobileNumber(tenant.mobile)) return res.handleResponse(400, {}, 'mobile wrong');
    if (tenant.idNo && !IDCard.IDIsValid(tenant.idNo)) return openToast({msg: 'idNo wrong'})

    tenant.mansionId = house.mansionId
    tenant.floor = house.floor
    tenant.room = house.room
    tenant.houseId = house._id
    tenant.type = 'in'

    tenant.rentalStartDate = utils.parseDate(newTenant.rentalStartDate) 
    if (!tenant.rentalStartDate) return res.handleResponse(400, {}, 'rentalStartDate is Invalid Date');
    tenant.rentalEndDate = utils.parseDate(newTenant.rentalEndDate)
    if (!tenant.rentalEndDate) return res.handleResponse(400, {}, 'rentalEndDate is Invalid Date');
    tenant.contractStartDate = utils.parseDate(newTenant.contractStartDate) 
    if (!tenant.contractStartDate) return res.handleResponse(400, {}, 'contractStartDate is Invalid Date');
    tenant.contractEndDate = utils.parseDate(newTenant.contractEndDate) 
    if (!tenant.contractEndDate) return res.handleResponse(400, {}, 'contractEndDate is Invalid Date');

    tenant.electricMeterEndNumber = Number(newTenant.electricMeterEndNumber)
    tenant.waterMeterEndNumber = Number(newTenant.waterMeterEndNumber)
    tenant.deposit = Number(newTenant.deposit)
    tenant.rental = Number(newTenant.rental)
    tenant.servicesCharges = Number(newTenant.servicesCharges)

    if (newTenant.isOweRental) {
      tenant.oweRental = Number(newTenant.oweRental)
      tenant.oweRentalExpiredDate = utils.parseDate(newTenant.oweRentalExpiredDate)
      if (!tenant.oweRentalExpiredDate) return res.handleResponse(400, {}, 'oweRentalExpiredDate is Invalid Date');
    }

    tenant.subscription = 0
    var subscriber = null
    if (house.subscriberId) {
      subscriber = await Subscriber.findOne({_id: house.subscriberId}).exec() //
      tenant.subscription = subscriber.subscription
      tenant.subscriberId = subscriber._id
    }
    
    tenant.waterChargesPerTon = mansion.houseWaterChargesMinimalTons
    tenant.waterCharges = 0
    tenant.electricChargesPerKWh = mansion.electricChargesPerKWh
    tenant.electricCharges = 0
    tenant.compensation = 0
    tenant.doorCardCount = newTenant.doorCardCount? Number(newTenant.doorCardCount): 0

    tenant.summed = tenant.deposit + tenant.rental + tenant.servicesCharges - tenant.subscription + (tenant.doorCardCount * mansion.doorCardSellCharges)

    if (isNaN(tenant.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (tenant.summed !== newTenant.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }
    tenant.createdBy = user._id
    tenant = await Tenant.create(tenant)

    house.tenantId = tenant._id
    house.subscriberId = null
    house.electricMeterEndNumber = newTenant.electricMeterEndNumber
    house.waterMeterEndNumber = newTenant.waterMeterEndNumber
    house.lastUpdatedAt = new Date()
    house = await house.save()
    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()

    if (subscriber) {
      subscriber.status = 'transfer'
      await subscriber.save()
    }
    return res.handleResponse(200, {mansionId, house})
  } catch(err) {
    log.error(err.name, err.message)
    if (tenant && tenant._id) {
      //删除新Tenant
      try {
        await Tenant.remove({_id: tenant._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseCheckIn = houseCheckIn;


/*
 * 交租
 */
const housePayRent = async (req, res) => {
  // var pickArray = ['remark']
  try{
    var body = req.body || {};
    var newHouse = body.house
    var newTenant = newHouse.tenantId
    // log.info(newTenant)
    var mansionId = newHouse.mansionId
    var user = req.user;
    var mansion = await Mansions.findOne({_id: mansionId, '$or': [{ownerId: user._id}, {'managers.userId': user._id}], deleted: false}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var house = await Houses.findOne({_id: newHouse._id, isExist: true, deleted: false}).populate('tenantId subscriberId').exec();
    if (!house) {
      return res.handleResponse(400, {}, 'house not found');
    }
    if (house.lastUpdatedAt.getTime() !==  (new Date(newHouse.lastUpdatedAt)).getTime()) {
      return res.handleResponse(409, {}, 'old data');
    }
    var oldTenant = house.tenantId
    if (_.isEmpty(oldTenant)) {
      return res.handleResponse(400, {}, 'house has not tenant')
    }
    if (oldTenant.oweRental) {
      return res.handleResponse(400, {}, 'house has owe rental');
    }

    var tenant = {}
    tenant.name = oldTenant.name
    tenant.mobile = newTenant.mobile
    tenant.idNo = newTenant.idNo || ''
    tenant.remark = newTenant.remark || ''
    if (!tenant.name) return res.handleResponse(400, {}, 'name is require');
    if (!tenant.mobile) return res.handleResponse(400, {}, 'mobile is require');
    if (!utils.isMobileNumber(tenant.mobile)) return res.handleResponse(400, {}, 'mobile wrong');
    if (tenant.idNo && !IDCard.IDIsValid(tenant.idNo)) return openToast({msg: 'idNo wrong'})

    tenant.mansionId = house.mansionId
    tenant.floor = house.floor
    tenant.room = house.room
    tenant.houseId = house._id
    tenant.type = 'rental'

    tenant.rentalStartDate = utils.parseDate(newTenant.rentalStartDate) 
    if (!tenant.rentalStartDate) return res.handleResponse(400, {}, 'rentalStartDate is Invalid Date');
    tenant.rentalEndDate = utils.parseDate(newTenant.rentalEndDate)
    if (!tenant.rentalEndDate) return res.handleResponse(400, {}, 'rentalEndDate is Invalid Date');
    tenant.contractStartDate = utils.parseDate(newTenant.contractStartDate) 
    if (!tenant.contractStartDate) return res.handleResponse(400, {}, 'contractStartDate is Invalid Date');
    tenant.contractEndDate = utils.parseDate(newTenant.contractEndDate) 
    if (!tenant.contractEndDate) return res.handleResponse(400, {}, 'contractEndDate is Invalid Date');

    tenant.deposit = oldTenant.deposit
    tenant.rental = Number(newTenant.rental)
    tenant.servicesCharges = Number(newTenant.servicesCharges)
    tenant.electricMeterEndNumber = Number(newTenant.electricMeterEndNumber)
    tenant.waterMeterEndNumber = Number(newTenant.waterMeterEndNumber)
    tenant.doorCardCount = oldTenant.doorCardCount
    tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
    tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh


    if (newTenant.isOweRental) {
      tenant.oweRental = Number(newTenant.oweRental)
      tenant.oweRentalExpiredDate = utils.parseDate(newTenant.oweRentalExpiredDate)
      if (!tenant.oweRentalExpiredDate) return res.handleResponse(400, {}, 'oweRentalExpiredDate is Invalid Date');
    }

    //计算电费
    var tenantElectricMeterEndNumber = Number(tenant.electricMeterEndNumber)
    if (tenantElectricMeterEndNumber < house.electricMeterEndNumber) {
      var electricMeterMax = house.electricMeterMax? house.electricMeterMax: mansion.houseElectricMeterMax
      tenant.electricKWhs = electricMeterMax - house.electricMeterEndNumber + tenantElectricMeterEndNumber + 1
    } else {
      tenant.electricKWhs = tenantElectricMeterEndNumber - house.electricMeterEndNumber
    }
    //限制最小用电量
    if (mansion.houseElectricChargesMinimalKWhs && tenant.electricKWhs<mansion.houseElectricChargesMinimalKWhs) {
      tenant.electricCharges = mansion.houseElectricChargesMinimalKWhs * tenant.electricChargesPerKWh
    } else {
      tenant.electricCharges = tenant.electricKWhs * tenant.electricChargesPerKWh
    }
    tenant.electricCharges = Number(tenant.electricCharges.toFixed(1))
    
    //计算水费
    var tenantWaterMeterEndNumber = Number(tenant.waterMeterEndNumber)
    if (tenantWaterMeterEndNumber < house.waterMeterEndNumber) {
      var waterMeterMax = house.waterMeterMax || mansion.houseWaterMeterMax
      tenant.waterTons = waterMeterMax - house.waterMeterEndNumber + tenantWaterMeterEndNumber + 1
    } else {
      tenant.waterTons = tenantWaterMeterEndNumber - house.waterMeterEndNumber
    }
    //限制最小用水量
    if (mansion.houseWaterChargesMinimalTons && tenant.waterTons<mansion.houseWaterChargesMinimalTons) {
      tenant.waterCharges = mansion.houseWaterChargesMinimalTons * tenant.waterChargesPerTon
    } else {
      tenant.waterCharges = tenant.waterTons * tenant.waterChargesPerTon
    }
    tenant.waterCharges = Number(tenant.waterCharges.toFixed(1))

    
    tenant.summed = Number(tenant.rental) + Number(tenant.servicesCharges) + Number(tenant.electricCharges) + Number(tenant.waterCharges)
    if (newTenant.isChangeDeposit) {
      tenant.deposit = Number(newTenant.deposit)
      tenant.summed += Number(tenant.deposit) - Number(oldTenant.deposit)
    }
    tenant.summed = Number(tenant.summed.toFixed(1))

    tenant.compensation = 0

    if (isNaN(tenant.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (tenant.summed !== newTenant.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }
    tenant.createdBy = user._id
    tenant = await Tenant.create(tenant)

    house.tenantId = tenant._id
    house.subscriberId = null
    house.electricMeterEndNumber = newTenant.electricMeterEndNumber
    house.waterMeterEndNumber = newTenant.waterMeterEndNumber
    house.lastUpdatedAt = new Date()
    house = await house.save()
    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()

    return res.handleResponse(200, {mansionId, house})
  } catch(err) {
    log.error(err.name, err.message)
    if (tenant && tenant._id) {
      //删除新Tenant
      try {
        await Tenant.remove({_id: tenant._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.housePayRent = housePayRent;


/*
 * 定房
 */
const houseSubscribe = async (req, res) => {
  try{
    var body = req.body || {};
    var newHouse = body.house
    var newSubscriber = newHouse.subscriberId
    log.info(newSubscriber)
    var mansionId = newHouse.mansionId
    var user = req.user;
    var mansion = await Mansions.findOne({_id: mansionId, '$or': [{ownerId: user._id}, {'managers.userId': user._id}], deleted: false}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var house = await Houses.findOne({_id: newHouse._id, isExist: true, deleted: false}).populate('subscriberId').exec();
    if (!house) {
      return res.handleResponse(400, {}, 'house not found');
    }
    if (house.lastUpdatedAt.getTime() !==  (new Date(newHouse.lastUpdatedAt)).getTime()) {
      return res.handleResponse(409, {}, 'old data');
    }
    if (house.tenantId) {
      return res.handleResponse(400, {}, 'house has tenant');
    }
    if (house.subscriberId) {
      return res.handleResponse(400, {}, 'house has subscribe');
    }

    var subscriber = {}
    subscriber.name = newSubscriber.name
    subscriber.mobile = newSubscriber.mobile
    subscriber.idNo = newSubscriber.idNo || ''
    subscriber.remark = newSubscriber.remark || ''
    if (!subscriber.name) return res.handleResponse(400, {}, 'name is require');
    if (!subscriber.mobile) return res.handleResponse(400, {}, 'mobile is require');
    if (!utils.isMobileNumber(subscriber.mobile)) return res.handleResponse(400, {}, 'mobile wrong');
    if (subscriber.idNo && !IDCard.IDIsValid(subscriber.idNo)) return openToast({msg: 'idNo wrong'})

    subscriber.mansionId = house.mansionId
    subscriber.floor = house.floor
    subscriber.room = house.room
    subscriber.houseId = house._id
    subscriber.status = 'normal'

    subscriber.createdAt = utils.parseDate(newSubscriber.createdAt) 
    if (!subscriber.rentalStartDate) subscriber.createdAt = new Date()
    subscriber.expiredDate = utils.parseDate(newSubscriber.expiredDate)
    if (!subscriber.expiredDate) return res.handleResponse(400, {}, 'expiredDate is Invalid Date');

    subscriber.subscription = Number(newSubscriber.subscription)


    subscriber.summed = newSubscriber.subscription

    if (isNaN(subscriber.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (subscriber.summed !== newSubscriber.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }
    subscriber.createdBy = user._id
    subscriber = await Subscriber.create(subscriber)

    house.subscriberId = subscriber._id
    house.lastUpdatedAt = new Date()
    house = await house.save()
    house = await Houses.findOne({_id: house._id}).populate('subscriberId').exec()

    return res.handleResponse(200, {mansionId, house})
  } catch(err) {
    log.error(err.name, err.message)
    if (subscriber && subscriber._id) {
      //删除新Subscriber
      try {
        await Subscriber.remove({_id: subscriber._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseSubscribe = houseSubscribe;





