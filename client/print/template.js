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
  <div style='height:258px, overflow:hidden;'>
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
  if (!charge) return '';
  var data = generateCommonData(mansion, house, charge)
  log.info(house, charge, data)
  switch (charge.type) {
    case 'subscribe':
      data.subTitle = '订金单'
      data.day = getValue(utils.parseDate(charge.subscriberId.subscribeDate))
      return buildSubscribeHtmlStr(data)
    case 'unsubscribe':
      data.subTitle = '退订金单'
      data.day = getValue(new Date())
      return buildUnsubscribeHtmlStr(data)

      //, 'checkin', 'repay', 'rental', 'checkout'
  }
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

function buildHtmlStrInner(data, contentHtmlStr) {
  var data = data || {}
  return printStr.replace('{title}', data.title)
                 .replace('{subTitle}', data.subTitle)
                 .replace('{room}', data.room)
                 .replace('{name}', data.name)
                 .replace('{day}', data.day)
                 .replace('{content}', contentHtmlStr)
}






