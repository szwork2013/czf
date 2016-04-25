'use strict';

import log from '../utils/log'
import utils from '../utils'
import moment from 'moment'

import { getValue, getRoom, getNumberChinese} from './common.js'

var printStr = `<div class='print-next-page print-container'>
  <div class='print-title'>
    {title}
  </div>
  <div class='print-sub-title'>
    {subTitle}
  </div>
  <div class='print-table-head'>
    <div class='print-left'>
      <span class='print-margin-right-s'>房号：{room}</span>
      <span class='print-margin-right-s'>姓名：{name}</span>
    </div>
    <div class='print-right'>
      <span class='print-margin-left'>{day}</span>
    </div>
  </div>
  <div style='height:258px; overflow:hidden;'>
    {content}
  </div>
  <div class='print-table-foot'>
    <div class='print-left'>
      <span class='print-margin-right-l'>出单：</span>
      <span class='print-margin-right-l'>收款：</span>
    </div>
    <div class='print-right'>
      <span class='print-margin-right-l'>租户：</span>
    </div>
  </div>
</div>`


function buildHtmlStr(mansion, house) {
  var mansion = mansion || {}
  var house = house || {}
  var charge = house.charge || {}
  var tenant = charge.tenantId || {}
  log.info(house, charge)
  if (!charge) return '';
  var retHtmlStr = '无支持的打印功能！'
  var data = generateCommonData(mansion, house, charge)
  // log.info(house, charge, data)
  switch (charge.type) {
    case 'subscribe':
      data.subTitle = '订金单'
      data.day = getValue(utils.parseDate(charge.subscriberId.subscribeDate))
      retHtmlStr = buildSubscribeHtmlStr(data)
      break;
    case 'unsubscribe':
      data.subTitle = '退订金单'
      data.day = getValue(new Date())
      retHtmlStr = buildUnsubscribeHtmlStr(data)
      break;
    case 'checkin':
      data.subTitle = '租房缴费单'
      data.day = getValue(utils.parseDate(charge.createdAt))
      retHtmlStr = buildPayRentHtmlStr(data)
      data.subTitle = '押金单'
      retHtmlStr += buildDepositHtmlStr(data)
      // log.info(charge.oweRental)
      if (charge.oweRental) {
        data.subTitle = '欠款单'
        retHtmlStr += buildOweRentalHtmlStr(data)
      }
      if (charge.doorCardCharges) {
        data.subTitle = '门卡单'
        retHtmlStr += buildDoorCardHtmlStr(data)
      }
      break;
    case 'repay':
      data.subTitle = '缴欠款单'
      data.day = getValue(utils.parseDate(charge.createdAt))
      retHtmlStr = buildRepayHtmlStr(data)
      break;
    case 'rental':
      data.subTitle = '租房缴费单'
      data.day = getValue(utils.parseDate(charge.createdAt))
      retHtmlStr = buildPayRentHtmlStr(data)
      if (charge.changeDeposit) {
        data.subTitle = '押金单'
        retHtmlStr += buildDepositHtmlStr(data)
      }
      if (charge.oweRental) {
        data.subTitle = '欠款单'
        retHtmlStr += buildOweRentalHtmlStr(data)
      }
      if (charge.doorCardCharges) {
        data.subTitle = '门卡单'
        retHtmlStr += buildDoorCardHtmlStr(data)
      }
      break;
    case 'checkout':
      data.subTitle = '退租结算单'
      data.day = getValue(utils.parseDate(charge.createdAt))
      retHtmlStr = buildCheckoutHtmlStr(data)
      if (charge.oweRentalRepay) {
        data.subTitle = '缴欠款单'
        retHtmlStr += buildRepayHtmlStr(data)
      }
      if (charge.doorCardRecoverCharges) {
        data.subTitle = '门卡单'
        retHtmlStr += buildDoorCardHtmlStr(data)
      }
      break;
      //, 'checkin', 'repay', 'rental', 'checkout'
  }
  return retHtmlStr
}
exports.buildHtmlStr = buildHtmlStr

function generateCommonData(mansion, house, charge) {
  var retObj = {}
  //房间信息
  retObj.title = getValue(mansion.invoiceTitle)
  retObj.room = getValue(getRoom(house.floor+1, house.room+1, mansion.floorDesLength, mansion.roomDesLength, mansion.floorDesPrefix))
  //租户信息
  var user = {}
  if (charge.subscriberId) {
    user = charge.subscriberId
    retObj.subscription = getValue(charge.subscription)
    retObj.subscriptionChinese = getNumberChinese(charge.subscription, 6, 1, false)
    // retObj.day = getValue(utils.parseDate(charge.createdAt))
    retObj.subscribeDate = getValue(utils.parseDate(charge.subscriberId.subscribeDate))
    retObj.expiredDate = getValue(utils.parseDate(charge.subscriberId.expiredDate))
    retObj.refund = getValue(Math.abs(charge.refund===undefined? 0: charge.refund))
    retObj.refundChinese = getNumberChinese(charge.refund, 6, 1, false)
  } else if (charge.tenantId) {
    user = charge.tenantId
    //电费
    retObj.electricMeterEndNumberLast = getValue(user.electricMeterEndNumberLast)
    retObj.electricMeterEndNumber = getValue(user.electricMeterEndNumber)
    retObj.electricChargesPerKWh = getValue(user.electricChargesPerKWh)
    retObj.electricKWhs = getValue(user.electricKWhs)
    retObj.electricCharges = getValue(charge.electricCharges)
    //水费
    retObj.waterMeterEndNumberLast = getValue(user.waterMeterEndNumberLast)
    retObj.waterMeterEndNumber = getValue(user.waterMeterEndNumber)
    retObj.waterChargesPerTon = getValue(user.waterChargesPerTon)
    retObj.waterTons = getValue(user.waterTons)
    retObj.waterCharges = getValue(charge.waterCharges)
    //房租
    retObj.rental = getValue(charge.rental)
    retObj.oweRental = getValue(charge.oweRental)
    retObj.oweRentalExpiredDate = getValue(utils.parseDate(user.oweRentalExpiredDate))
    //管理费
    retObj.servicesCharges = getValue(charge.servicesCharges)
    retObj.servicesChargesDes = getValue(mansion.houseServicesChargesDes) || '卫生、管理费'
    //租房总计
    retObj.rentalStartDate = getValue(utils.parseDate(user.rentalStartDate))
    retObj.rentalEndDate = getValue(utils.parseDate(user.rentalEndDate))
    // log.info(typeof retObj.electricCharges, typeof retObj.waterCharges, typeof retObj.rental, typeof retObj.oweRental, typeof retObj.servicesCharges)
    retObj.rentalSummed = charge.electricCharges + charge.waterCharges + charge.rental - charge.oweRental + charge.servicesCharges
    if (retObj.rentalSummed>=0) {
      retObj.rentalSummedDes = '实收'
    } else {
      retObj.rentalSummedDes = '实退'
      retObj.rentalSummed = -retObj.rentalSummed
    }
    retObj.rentalSummedChinese = getNumberChinese(retObj.rentalSummed, 6, 1, false)

    //退房合计
    retObj.overdueCharges = getValue(charge.overdueCharges)
    retObj.compensation = getValue(charge.compensation)
    retObj.checkoutSummed = charge.electricCharges + charge.waterCharges + charge.overdueCharges + charge.compensation - charge.deposit
    if (retObj.checkoutSummed>=0) {
      retObj.checkoutSummedDes = '实收'
    } else {
      retObj.checkoutSummedDes = '实退'
      retObj.checkoutSummed = -retObj.checkoutSummed
    }
    retObj.checkoutSummedChinese = getNumberChinese(retObj.checkoutSummed, 6, 1, false)

    //押金
    retObj.changeDeposit = getValue(charge.changeDeposit)
    retObj.deposit = getValue(charge.deposit)
    retObj.depositChinese = getNumberChinese(charge.deposit, 6, 1, false)

    //
    if (charge.oweRental) {
      retObj.oweRental = getValue(charge.oweRental)
      retObj.oweRentalChinese = getNumberChinese(charge.oweRental, 6, 1, false)
      retObj.realRental = charge.rental - charge.oweRental
      retObj.oweRentalExpiredDate = getValue(utils.parseDate(user.oweRentalExpiredDate))
    }
    if (charge.oweRentalRepay) {
      retObj.oweRentalRepay = getValue(charge.oweRentalRepay)
      retObj.oweRentalRepayChinese = getNumberChinese(charge.oweRentalRepay, 6, 1, false)
    }
  }
  if (charge.doorCardCharges) {
    retObj.doorCardCount = getValue(charge.doorCardCount)
    retObj.doorCardCharges = getValue(charge.doorCardCharges)
    retObj.doorCardChargesChinese = getNumberChinese(charge.doorCardCharges, 6, 1, false)
    retObj.doorCardSellOrRecoverDes = '购买'
    retObj.doorCardChargesDes = '实收'
  }
  if (charge.doorCardRecoverCharges) {
    retObj.doorCardCount = getValue(charge.doorCardCount)
    retObj.doorCardCharges = getValue(charge.doorCardRecoverCharges)
    retObj.doorCardChargesChinese = getNumberChinese(charge.doorCardRecoverCharges, 6, 1, false)
    retObj.doorCardSellOrRecoverDes = '退回'
    retObj.doorCardChargesDes = '实退'
  }
  retObj.name = getValue(user.name)
  retObj.mobile = getValue(user.mobile)
  retObj.idNo = getValue(user.idNo)
  retObj.summed = getValue(user.summed)
  retObj.summedChinese = retObj.summed
  retObj.remark = getValue(user.remark)
  return retObj
}

/*
 * 订房
 */
import subscribe from './subscribe'
function buildSubscribeHtmlStr(data) {
  return buildHtmlStrInner(data, subscribe.build(data))
}

/*
 * 退订房
 */
import unsubscribe from './unsubscribe'
function buildUnsubscribeHtmlStr(data) {
  return buildHtmlStrInner(data, unsubscribe.build(data))
}

/*
 * 房租
 */
import payRent from './pay_rent'
function buildPayRentHtmlStr(data) {
  return buildHtmlStrInner(data, payRent.build(data))
}

/*
 * 押金
 */
import deposit from './deposit'
function buildDepositHtmlStr(data) {
  return buildHtmlStrInner(data, deposit.build(data))
}

/*
 * 欠款
 */
import oweRental from './owe_rental'
function buildOweRentalHtmlStr(data) {
  return buildHtmlStrInner(data, oweRental.build(data))
}

/*
 * 门卡
 */
import doorCard from './door_card'
function buildDoorCardHtmlStr(data) {
  return buildHtmlStrInner(data, doorCard.build(data))
}

/*
 * 补欠款
 */
import repay from './repay'
function buildRepayHtmlStr(data) {
  return buildHtmlStrInner(data, repay.build(data))
}

/*
 * 补欠款
 */
import checkout from './checkout'
function buildCheckoutHtmlStr(data) {
  return buildHtmlStrInner(data, checkout.build(data))
}


function buildHtmlStrInner(data, contentHtmlStr) {
  var data = data || {}
  return printStr.replace('{title}', data.title)
                 .replace('{subTitle}', data.subTitle)
                 .replace('{room}', data.room)
                 .replace('{name}', data.name)
                 .replace('{day}', data.day)
                 .replace('{content}', contentHtmlStr)
}






