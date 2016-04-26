'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import IDCard from '../../utils/identitycard'
import config from '../../config';

import nodeExcel from 'excel-export'

import { Users, UsersOmit, Mansions, HouseLayouts, defaultHouseLayouts, 
        Houses, Tenant, Subscriber, Shops, Charges } from '../../models';

import moment from 'moment';



/*
 * 定房
 */
const houseSubscribe = async (req, res) => {
  try{
    var body = req.body || {};
    var newHouse = body.house
    var newSubscriber = newHouse.subscriberId
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
    subscriber.status = 'valid'

    subscriber.subscription = Number(newSubscriber.subscription)
    subscriber.subscribeDate = utils.parseDate(newSubscriber.subscribeDate) 
    if (!subscriber.subscribeDate) subscriber.subscribeDate = new moment().startOf('day').toDate()
    subscriber.expiredDate = utils.parseDate(newSubscriber.expiredDate)
    if (!subscriber.expiredDate) return res.handleResponse(400, {}, 'expiredDate is Invalid Date');

    subscriber.summed = newSubscriber.subscription

    if (isNaN(subscriber.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (subscriber.summed !== newSubscriber.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }

    subscriber.remark = newSubscriber.remark || ''
    subscriber.createdAt = new Date()
    subscriber.createdBy = user._id
    subscriber.lastUpdatedAt = subscriber.createdAt
    
    //新建定房
    subscriber = await Subscriber.create(subscriber)

    //保存计费信息
    var charge = _.pick(subscriber, ['mansionId', 'houseId', 'floor', 'room', 
      'subscription', 'summed', 'remark', 'createdBy'])
    charge.subscriberId = subscriber._id
    charge.type = 'subscribe'
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('subscriberId').exec()

    //修改出租房相关属性
    house.subscriberId = subscriber._id
    house.lastUpdatedAt = new Date()
    house = await house.save()

    house = await Houses.findOne({_id: house._id}).populate('subscriberId').exec()
    return res.handleResponse(200, {mansionId, house, charge})

  } catch(err) {
    log.error(err.name, err.message)
    if (subscriber && subscriber._id) {
      //删除新Subscriber
      try {
        await Subscriber.remove({_id: subscriber._id})
      } catch(error) {}
      //删除计费
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseSubscribe = houseSubscribe;










/*
 * 退定
 */
const houseUnsubscribe = async (req, res) => {
  try{
    var body = req.body || {};
    var newHouse = body.house
    var newSubscriber = newHouse.subscriberId
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
    if (!house.subscriberId) {
      return res.handleResponse(400, {}, 'house has not subscribe');
    }

    var subscriber = await Subscriber.findOne({_id: house.subscriberId}).exec()
    var subscriberBackup = _.pick(subscriber, ['remark', 'status', 'refund', 'lastUpdatedAt'])
  
    subscriber.status = 'unsubscribe'
    subscriber.summed = 0
    subscriber.refund = 0
    if (newSubscriber.isRefund) {
      subscriber.refund = Number(newSubscriber.refund)
      subscriber.summed = -subscriber.refund
    }

    if (isNaN(subscriber.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (subscriber.summed !== newSubscriber.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }

    subscriber.remark = newSubscriber.remark || ''
    subscriber.lastUpdatedAt = new Date()
    await subscriber.save()

    //保存计费信息
    var charge = _.pick(subscriber, ['mansionId', 'houseId', 'floor', 'room', 
      'subscription', 'refund', 'summed', 'remark'])
    charge.subscriberId = subscriber._id
    charge.type = 'unsubscribe'
    charge.createdBy = user._id
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('subscriberId').exec()

    house.subscriberId = null
    house.lastUpdatedAt = new Date()
    house = await house.save()
    house = await Houses.findOne({_id: house._id}).exec()

    return res.handleResponse(200, {mansionId, house, charge})
  } catch(err) {
    log.error(err)
    if (subscriber && subscriber._id) {
      //删除新Subscriber
      try {
        _.assign(subscriber, subscriberBackup)
        await subscriber.save()
      } catch(error) {}
      //删除计费
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseUnsubscribe = houseUnsubscribe;










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
    if (!tenant.name) return res.handleResponse(400, {}, 'name is require');
    if (!tenant.mobile) return res.handleResponse(400, {}, 'mobile is require');
    if (!utils.isMobileNumber(tenant.mobile)) return res.handleResponse(400, {}, 'mobile wrong');
    if (tenant.idNo && !IDCard.IDIsValid(tenant.idNo)) return openToast({msg: 'idNo wrong'})

    tenant.mansionId = house.mansionId
    tenant.floor = house.floor
    tenant.room = house.room
    tenant.houseId = house._id
    tenant.type = 'in'

    tenant.subscription = 0
    var subscriber = null
    if (house.subscriberId) {
      subscriber = await Subscriber.findOne({_id: house.subscriberId}).exec() //
      if (subscriber.status === 'valid') {
        tenant.subscription = subscriber.subscription
        tenant.subscriberId = subscriber._id
      } else {
        subscriber = null
      }
    }

    tenant.deposit = Number(newTenant.deposit)
    tenant.rental = Number(newTenant.rental)
    tenant.oweRental = 0
    if (newTenant.isOweRental) {
      tenant.oweRental = Number(newTenant.oweRental)
      tenant.oweRentalExpiredDate = utils.parseDate(newTenant.oweRentalExpiredDate)
      if (!tenant.oweRentalExpiredDate) return res.handleResponse(400, {}, 'oweRentalExpiredDate is Invalid Date');
    }

    tenant.rentalStartDate = utils.parseDate(newTenant.rentalStartDate) 
    if (!tenant.rentalStartDate) return res.handleResponse(400, {}, 'rentalStartDate is Invalid Date');
    tenant.rentalEndDate = utils.parseDate(newTenant.rentalEndDate)
    if (!tenant.rentalEndDate) return res.handleResponse(400, {}, 'rentalEndDate is Invalid Date');
    tenant.contractStartDate = utils.parseDate(newTenant.contractStartDate) 
    if (!tenant.contractStartDate) return res.handleResponse(400, {}, 'contractStartDate is Invalid Date');
    tenant.contractEndDate = utils.parseDate(newTenant.contractEndDate) 
    if (!tenant.contractEndDate) return res.handleResponse(400, {}, 'contractEndDate is Invalid Date');

    tenant.electricMeterEndNumberLast = Number(newTenant.electricMeterEndNumber)
    tenant.electricMeterEndNumber = Number(newTenant.electricMeterEndNumber)
    tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh
    tenant.electricKWhs = 0
    tenant.electricCharges = 0
    tenant.waterMeterEndNumberLast = Number(newTenant.waterMeterEndNumber)
    tenant.waterMeterEndNumber = Number(newTenant.waterMeterEndNumber)
    tenant.waterChargesPerTon = mansion.houseWaterChargesMinimalTons
    tenant.waterTons = 0
    tenant.waterCharges = 0
    
    tenant.doorCardCount = newTenant.doorCardCount? Number(newTenant.doorCardCount): 0
    tenant.doorCardCharges = tenant.doorCardCount * mansion.doorCardSellCharges
    
    tenant.servicesCharges = Number(newTenant.servicesCharges)

    // log.info(tenant.deposit , tenant.rental , tenant.servicesCharges , - tenant.subscription , tenant.doorCardCharges)
    tenant.summed = tenant.deposit + tenant.rental + tenant.servicesCharges - tenant.subscription + tenant.doorCardCharges - tenant.oweRental

    if (isNaN(tenant.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (tenant.summed !== newTenant.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }

    tenant.remark = newTenant.remark || ''
    tenant.createdBy = user._id
    tenant.createdAt = new Date()
    tenant.lastUpdatedAt = tenant.createdAt

    //保存出租房信息
    tenant = await Tenant.create(tenant)

    //保存计费信息
    var charge = _.pick(tenant, ['mansionId', 'houseId', 'floor', 'room', 
      'subscription', 'deposit', 'rental', 'oweRental', 'waterCharges', 'electricCharges', 
      'servicesCharges', 'doorCardCount', 'doorCardCharges', 'summed', 'remark',])
    charge.tenantId = tenant._id
    charge.type = 'checkin'
    charge.createdBy = user._id
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('tenantId').exec()

    //定房信息
    var oldSubscriber = _.pick(subscriber, ['status', 'lastUpdatedAt'])
    if (subscriber) {
      subscriber.status = 'transfer'
      subscriber.lastUpdatedAt = new Date()
      await subscriber.save()
    }

    //修改出租房相关属性
    house.tenantId = tenant._id
    house.subscriberId = null
    house.electricMeterEndNumber = newTenant.electricMeterEndNumber
    house.waterMeterEndNumber = newTenant.waterMeterEndNumber
    house.lastUpdatedAt = new Date()
    house = await house.save()

    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()
    return res.handleResponse(200, {mansionId, house, charge})

  } catch(err) {
    log.error(err)
    if (tenant && tenant._id) {
      //删除新Tenant
      try {
        await Tenant.remove({_id: tenant._id})
      } catch(error) {}
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      try {
        _.assign(subscriber, oldSubscriber)
        await subscriber.save()
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseCheckIn = houseCheckIn;









/*
 * 补交欠款
 */
const houseRepay = async (req, res) => {
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
    if (!oldTenant.oweRental) {
      return res.handleResponse(400, {}, 'house has not owe rental');
    }

    newTenant.oweRental = Number(newTenant.oweRental)
    newTenant.oweRentalRepay = Number(newTenant.oweRentalRepay)
    if (newTenant.oweRental !== newTenant.oweRentalRepay) {
      return res.handleResponse(400, {}, 'the owe rental must pay all once');
    }
    if (newTenant.oweRental !== oldTenant.oweRental) {
      return res.handleResponse(400, {}, 'old data');
    }
    if (isNaN(newTenant.oweRentalRepay)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    var oldTenantBackup = _.pick(oldTenant, ['oweRentalRepay', 'oweRental', 'rental', 'remark', 'lastUpdatedAt'])
    oldTenant.oweRentalRepay = newTenant.oweRentalRepay
    oldTenant.oweRental = oldTenant.oweRentalRepay - newTenant.oweRentalRepay
    // oldTenant.rental += oldTenant.oweRentalRepay
    oldTenant.remark = newTenant.remark
    oldTenant.lastUpdatedAt = new Date()

    oldTenant = await oldTenant.save()

    //保存计费信息
    var charge = _.pick(oldTenant, ['mansionId', 'houseId', 'floor', 'room', 
      'oweRentalRepay', 'remark', ])
    charge.tenantId = oldTenant._id
    charge.summed = oldTenant.oweRentalRepay 
    charge.type = 'repay'
    charge.createdBy = user._id
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('tenantId').exec()

    //修改出租房相关属性
    house.lastUpdatedAt = new Date()
    house = await house.save()

    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()
    return res.handleResponse(200, {mansionId, house, charge})

  } catch(err) {
    log.error(err)
    if (oldTenant && oldTenant._id) {
      //恢复Tenant
      try {
        _.assign(oldTenant, oldTenantBackup)
        await oldTenant.save()
      } catch(error) {}
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseRepay = houseRepay;










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
    tenant.electricMeterEndNumberLast = house.electricMeterEndNumber
    tenant.electricMeterEndNumber = Number(newTenant.electricMeterEndNumber)
    tenant.waterMeterEndNumberLast = house.waterMeterEndNumber
    tenant.waterMeterEndNumber = Number(newTenant.waterMeterEndNumber)
    tenant.doorCardCount = oldTenant.doorCardCount
    tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
    tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh

    tenant.oweRental = 0
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

    tenant.summed = Number(tenant.rental) + Number(tenant.servicesCharges) + Number(tenant.electricCharges) + Number(tenant.waterCharges) - tenant.oweRental
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
    tenant.remark = newTenant.remark || ''
    tenant.createdBy = user._id
    tenant.createdAt = new Date()
    tenant.lastUpdatedAt = tenant.createdAt

    tenant = await Tenant.create(tenant)

    //保存计费信息
    var charge = _.pick(tenant, ['mansionId', 'houseId', 'floor', 'room', 
      'rental','servicesCharges', 'waterCharges', 'electricCharges', 
      'oweRental', 'deposit', 'summed', 'remark',])
    charge.tenantId = tenant._id
    charge.type = 'rental'
    charge.changeDeposit = Number(tenant.deposit) - Number(oldTenant.deposit)
    charge.createdBy = user._id
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('tenantId').exec()

    //修改房间相关信息
    var houseBackup = _.pick(house, ['tenantId', 'subscriberId', 'electricMeterEndNumber', 'waterMeterEndNumber', 'lastUpdatedAt'])
    house.tenantId = tenant._id
    house.subscriberId = null
    house.electricMeterEndNumber = newTenant.electricMeterEndNumber
    house.waterMeterEndNumber = newTenant.waterMeterEndNumber
    house.lastUpdatedAt = new Date()
    house = await house.save()

    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()
    return res.handleResponse(200, {mansionId, house, charge})

  } catch(err) {
    log.error(err)
    if (tenant && tenant._id) {
      //删除新Tenant
      try {
        await Tenant.remove({_id: tenant._id})
      } catch(error) {}
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.housePayRent = housePayRent;












/*
 * 退房
 */
const houseCheckOut = async (req, res) => {
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
    var house = await Houses.findOne({_id: newHouse._id, isExist: true, deleted: false}).populate('tenantId').exec();
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
    // if (oldTenant.oweRental) {
    //   return res.handleResponse(400, {}, 'house has owe rental');
    // }

    var tenant = _.pick(oldTenant, ['name', 'mobile', 'idNo', 'rentalStartDate', 'rentalEndDate', 
      'contractStartDate', 'contractEndDate', 'deposit', 'doorCardCount', 'oweRental', 'oweRentalExpiredDate'])
    tenant.remark = newTenant.remark || ''
    tenant.mansionId = house.mansionId
    tenant.floor = house.floor
    tenant.room = house.room
    tenant.houseId = house._id
    tenant.type = 'out'

    tenant.rental = 0
    tenant.servicesCharges = 0

    tenant.electricMeterEndNumberLast = house.electricMeterEndNumber
    tenant.electricMeterEndNumber = Number(newTenant.electricMeterEndNumber)
    tenant.waterMeterEndNumberLast = house.waterMeterEndNumber
    tenant.waterMeterEndNumber = Number(newTenant.waterMeterEndNumber)
    tenant.doorCardRecoverCount = Number(newTenant.doorCardRecoverCount) || 0
    tenant.waterChargesPerTon = mansion.houseWaterChargesPerTon
    tenant.electricChargesPerKWh = mansion.houseElectricChargesPerKWh

    tenant.overdueDays = new moment().diff(tenant.rentalEndDate, 'days')
    tenant.overdueCharges = Number(newTenant.overdueCharges) || 0
    tenant.compensation = Number(newTenant.compensation) || 0
    tenant.doorCardRecoverCharges = 0

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

    
    tenant.summed = Number(tenant.electricCharges) + Number(tenant.waterCharges) - Number(tenant.deposit)
    if (tenant.oweRental>0) {
      tenant.summed += tenant.oweRental
      tenant.oweRentalRepay = tenant.oweRental
      tenant.oweRental = 0
    }
    
    if (tenant.doorCardRecoverCount>0) {
      tenant.doorCardRecoverCharges = tenant.doorCardRecoverCount*mansion.doorCardRecoverCharges
      tenant.summed -= tenant.doorCardRecoverCharges
    }
    tenant.summed +=  tenant.overdueCharges + tenant.compensation
    
    tenant.summed = Number(tenant.summed.toFixed(1))

    if (isNaN(tenant.summed)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
    }
    if (tenant.summed !== newTenant.summed) {
      return res.handleResponse(400, {}, 'calc summed diff');
    }
    tenant.createdBy = user._id
    tenant = await Tenant.create(tenant)

    //保存计费信息
    var charge = _.pick(tenant, ['mansionId', 'houseId', 'floor', 'room', 
      'waterCharges', 'electricCharges', 'deposit', 
      'doorCardRecoverCharges', 'overdueCharges', 'compensation',
      'oweRental', 'oweRentalRepay', 'summed', 'remark',])
    charge.tenantId = tenant._id
    charge.type = 'checkout'
    charge.doorCardCount = tenant.doorCardRecoverCount
    charge.createdBy = user._id
    charge.createdAt = new Date()
    charge = await Charges.create(charge)
    charge = await Charges.findOne({_id: charge._id}).populate('tenantId').exec()

    //修改房间相关信息
    var houseBackup = _.pick(house, ['tenantId', 'subscriberId', 'electricMeterEndNumber', 'waterMeterEndNumber', 'lastUpdatedAt'])
    house.tenantId = null
    house.subscriberId = null
    house.electricMeterEndNumber = newTenant.electricMeterEndNumber
    house.waterMeterEndNumber = newTenant.waterMeterEndNumber
    house.lastUpdatedAt = new Date()
    house = await house.save()

    house = await Houses.findOne({_id: house._id}).populate('tenantId').exec()
    return res.handleResponse(200, {mansionId, house, charge})

  } catch(err) {
    log.error(err)
    if (tenant && tenant._id) {
      //删除新Tenant
      try {
        await Tenant.remove({_id: tenant._id})
      } catch(error) {}
      try {
        await Charges.remove({_id: charge._id})
      } catch(error) {}
      //因为house.save()在最后才执行，如果报错的话，证明没保存成功，不需要还原
    }
    return res.handleResponse(500, {});
  }
}
exports.houseCheckOut = houseCheckOut;




/*
 * 房间信息下载
 */
const exportExcel = async (req, res) => {
  try{
    var query = req.query || querystring.parse(require('url').parse(req.url).query) || {};
    var user = req.user
    var mansionId = query.mansionId
    var mansion = await Mansions.findOne({_id: mansionId, '$or': [{ownerId: user._id}, {'managers.userId': user._id}], deleted: false}).exec();
    if (!mansion) {
      return res.handleResponse(400, {}, 'mansion not found');
    }
    var floorIdx = query.floorIdx===undefined? -1: Number(query.floorIdx)
    var houseIdx = query.houseIdx===undefined? -1: Number(query.houseIdx)
    var houseLayout = query.houseLayout===undefined? 'all': query.houseLayout
    var showHouse = query.showHouse===undefined? 'all': query.showHouse
    var searchStr = query.searchStr

    var housesCond = {
      mansionId: mansionId, 
      deleted: false, 
      isExist: true
    }
    if (floorIdx!==-1) {
      housesCond.floor = floorIdx
      if (houseIdx!==-1) {
        housesCond.room = houseIdx
      }
    }
    if (houseLayout!=='all') {
      housesCond.houseLayout = houseLayout
    }
    var houses = await Houses.find(housesCond).sort({floor: 1, room: 1}).populate('tenantId subscriberId').exec()
    var now = new Date()
    if (showHouse !== 'all') {
      switch (showHouse) {
        case 'tenantable':
          houses = houses.filter( house => {
            return !house.tenantId && !house.subscriberId
          })
          break;
        case 'tenanted':
          houses = houses.filter( house => {
            return house.tenantId
          })
          break;
        case 'subscribed':
          houses = houses.filter( house => {
            return house.subscriberId
          })
          break;
        case 'subscribedExpired':
          houses = houses.filter( house => {
            return house.subscriberId && house.subscriberId.expiredDate<now
          })
          break;
        case 'oweRental':
          houses = houses.filter( house => {
            return house.tenantId && house.tenantId.oweRental>0
          })
          break;
        case 'oweRentalEnd':
          houses = houses.filter( house => {
            return house.tenantId && house.tenantId.oweRental>0 && house.tenantId.oweRentalExpiredDate < now
          })
          break;
        case 'rentalEndSoon':
          var houseRentalEndNotifyBeforeDay = Number(mansion.houseRentalEndNotifyBeforeDay) || 3
          var houseRentalEndNotifyBeforeMinSec = 1000*60*60*24*houseRentalEndNotifyBeforeDay
          houses = houses.filter( house => {
            if (house.tenantId) {
              var diff = house.tenantId.rentalEndDate-now
              return 0<diff && diff<houseRentalEndNotifyBeforeMinSec
            }
            return false
          })
          break;
        case 'rentalEnd':
          houses = houses.filter( house => {
            return house.tenantId && house.tenantId.rentalEndDate<now
          })
          break;
        case 'contractEndSoon':
          var houseContractEndNotifyBeforeDay = Number(mansion.houseContractEndNotifyBeforeDay) || 3
          var houseContractEndNotifyBeforeMinSec = 1000*60*60*24*houseContractEndNotifyBeforeDay
          houses = houses.filter( house => {
            if (house.tenantId) {
              var diff = house.tenantId.contractEndDate-now
              return 0<diff && diff<houseContractEndNotifyBeforeMinSec
            }
            return false
          })
          break;
        case 'contractEnd':
          houses = houses.filter( house => {
            return house.tenantId && house.tenantId.contractEndDate<now
          })
          break;
        default:
          houses = []
      }
    } 
    if (!_.isEmpty(searchStr)) {
      var tenant = {}
      houses = houses.filter( house => {
        if(house.tenantId) {
          tenant = house.tenantId
          return (tenant.name && tenant.name.search(searchStr)!==-1) || 
                 (tenant.mobile && tenant.mobile.search(searchStr)!==-1) || 
                 (tenant.idNo && tenant.idNo.search(searchStr)!==-1) ||
                 (tenant.remark && tenant.remark.search(searchStr)!==-1)
        } else 
          return false
      })
    }
    var houseLayoutsArray = await HouseLayouts.find({mansionId: mansionId, deleted: false}).sort({order: 1}).exec()
    var houseLayouts = {}
    houseLayoutsArray.forEach(houseLayout => {
      houseLayouts[houseLayout._id.toString()] = houseLayout.description
    })

    var conf ={};
    // conf.stylesXmlFile = "styles.xml";
    conf.name = "sheet1";
    conf.cols = [{
      caption: '索引',
      type: 'string',
    }, {
      caption: '楼层',
      type: 'string',
    }, {
      caption: '房间',
      type: 'string',
    }, {
      caption: '户型',
      type: 'string',
    }, {
      caption: '状态',
      type: 'string',
    }, {
      caption: '姓名',
      type: 'string',
    }, {
      caption: '手机',
      type: 'string',
    }, {
      caption: '电表',
      type: 'string',
    }, {
      caption: '水表',
      type: 'string',
    }, {
      caption: '下次交租',
      type: 'string',
    }, {
      caption: '合同终止',
      type: 'string',
    }, {
      caption: '备注',
      type: 'string',
    }]
    conf.rows = []

    houses.forEach( (house, idx) => {
      var row = []
      var remarkExpand = ''
      row.push((idx+1).toString())
      row.push((house.floor+1).toString())
      row.push((house.room+1).toString())
      row.push(houseLayouts[house.houseLayout])
      if (house.tenantId) {
        var tenant = house.tenantId
        if (tenant.oweRental) {
          row.push('欠')
          remarkExpand += '（欠租' + tenant.oweRental+'元'
          if (tenant.oweRentalExpiredDate < now) remarkExpand+='，过期'
          remarkExpand += '）'
        } else {
          row.push('租')
        }
        row.push(tenant.name || '')
        row.push(tenant.mobile || '')
        row.push(house.electricMeterEndNumber.toString())
        row.push(house.waterMeterEndNumber.toString())
        row.push(new moment(tenant.rentalEndDate).format('YYYY.MM.DD'))
        row.push(new moment(tenant.contractEndDate).format('YYYY.MM.DD'))
        row.push((tenant.remark || '')+remarkExpand)
      } else if (house.subscriberId) {
        var subscriber = house.subscriberId
        remarkExpand += '（定金' + subscriber.subscription+'元'
        if (subscriber.expiredDate < now) remarkExpand+='，过期'
        remarkExpand += '）'
        row.push('定')
        row.push(subscriber.name || '')
        row.push(subscriber.mobile || '')
        row.push(house.electricMeterEndNumber.toString())
        row.push(house.waterMeterEndNumber.toString())
        row.push('')
        row.push(new moment(subscriber.expiredDate).format('YYYY.MM.DD'))
        row.push((subscriber.remark || '')+remarkExpand)
      } else {
        row.push('空')
        row.push('')
        row.push('')
        row.push(house.electricMeterEndNumber.toString())
        row.push(house.waterMeterEndNumber.toString())
        row.push('')
        row.push('')
        row.push(remarkExpand)
      }
      conf.rows.push(row)
    })
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + (new Date()).getTime() + ".xlsx");
    res.end(result, 'binary');
  } catch(err) {
    log.error(err)
    return res.handleResponse(500, {});
  }
}
exports.exportExcel = exportExcel;

