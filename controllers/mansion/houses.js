'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
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
    var mansion = await Mansions.findOne({_id: mansionId, ownerId: user._id, deleted: false}).exec();
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

    var tenant = {}
    tenant.name = newTenant.name
    tenant.mobile = newTenant.mobile
    tenant.idNo = newTenant.idNo || ''
    tenant.remark = newTenant.remark || ''
    if (!tenant.name) return res.handleResponse(400, {}, 'name is require');
    if (!tenant.mobile) return res.handleResponse(400, {}, 'mobile is require');
    if (!utils.isMobileNumber(tenant.mobile)) return res.handleResponse(400, {}, 'mobile wrong');

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

    tenant.electricMeterEndNumber = newTenant.electricMeterEndNumber
    tenant.waterMeterEndNumber = newTenant.waterMeterEndNumber
    tenant.deposit = newTenant.deposit
    tenant.rental = newTenant.rental
    tenant.servicesCharges = newTenant.servicesCharges

    if (newTenant.isOwnRental) {
      tenant.oweRental = newTenant.oweRental
      tenant.oweRentalExpiredDate = utils.parseDate(newTenant.oweRentalExpiredDate)
      if (!tenant.oweRentalExpiredDate) return res.handleResponse(400, {}, 'oweRentalExpiredDate is Invalid Date');
    }

    tenant.subscription = 0
    if (house.subscriberId) {
      var subscriber = house.subscriberId
      tenant.subscription = subscriber.subscription
      tenant.subscriberId = subscriber._id
    }
    
    var summed = tenant.summed = {}

    summed.subscription = tenant.subscription
    summed.deposit = tenant.deposit
    summed.rental = tenant.rental
    summed.waterCharges = 0
    summed.electricCharges = 0
    summed.servicesCharges = tenant.servicesCharges
    summed.compensation = 0
    summed.total = summed.deposit + summed.rental + summed.servicesCharges - summed.subscription
    if (isNaN(summed.total)) {
      return res.handleResponse(400, {}, 'calc summed return NaN');
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
    // log.info(house)

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









