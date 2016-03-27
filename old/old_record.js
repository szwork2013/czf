'use strict';

import path from 'path';
import fs from 'mz/fs';
import log from '../utils/log';
import { Iconv } from 'iconv';

// let historyFilePath = 'rentroomdata_1.rdt'
// let historyFileAbsPath = path.join(process.cwd(), 'old', historyFilePath);
let longIntLength = 4

const readDate = (buf, offset) => {
    let year = buf.readInt32LE(offset);
    offset += 4;
    let month = buf.readInt32LE(offset)-1;
    offset += 4;
    let day = buf.readInt32LE(offset);
    offset += 4;
    let hour = buf.readInt32LE(offset);
    offset += 4;
    let minute = buf.readInt32LE(offset);
    offset += 4;
    let second = buf.readInt32LE(offset);
    offset += 4;
    return new Date(year, month, day, hour,minute, second)

}

const loadRentFile = async (historyFilePath) => {
  var historyFileAbsPath = path.join(process.cwd(), historyFilePath)
  try {
    // log.info(historyFileAbsPath);
    var retObj = {}
    // log.warn('prepare to load history file: ', historyFileAbsPath);
    let isExist = await fs.exists(historyFilePath);
    if (isExist) {
      let buf = null;
      try {
        buf = await fs.readFile(historyFileAbsPath)
      } catch (err) {
        log.error(err.name, err.message);
        return retObj;
      }
      let offset = 0
      if(buf.readInt8(offset) != 1) {
        log.error('file is broken');       //文件是否完整标志位
        return retObj;
      }
      offset += 1;
      let len = 0;
      let iconv = new Iconv('GBK', 'UTF-8//IGNORE');
      //楼名
      len = buf.readInt32LE(offset);
      offset += 4
      retObj.mansionName = iconv.convert(buf.slice(offset, offset+len)).toString();
      offset += len;
      log.trace('mansionName: ', retObj.mansionName);
      //售门卡
      retObj.doorCardSellCharges = buf.readFloatLE(offset);
      retObj.doorCardSellCharges = retObj.doorCardSellCharges.toFixed(1);
      offset += 4;
      log.trace('doorCardSellCharges: ', retObj.doorCardSellCharges);
      //电费
      retObj.houseElectricChargesPerKWh = buf.readFloatLE(offset);
      retObj.houseElectricChargesPerKWh = retObj.houseElectricChargesPerKWh.toFixed(1);
      offset += 4;
      log.trace('houseElectricChargesPerKWh: ', retObj.houseElectricChargesPerKWh);
      //回收门卡
      retObj.doorCardRecoverCharges = buf.readInt32LE(offset);
      offset += 4;
      log.trace('doorCardRecoverCharges: ', retObj.doorCardRecoverCharges);
      //愈期罚款
      retObj.houseOverdueFineForLayoutPerDay0 = buf.readFloatLE(offset);
      retObj.houseOverdueFineForLayoutPerDay0 = retObj.houseOverdueFineForLayoutPerDay0.toFixed(1);
      offset += 4;
      log.trace('houseOverdueFineForLayoutPerDay0: ', retObj.houseOverdueFineForLayoutPerDay0);
      retObj.houseOverdueFineForLayoutPerDay1 = buf.readFloatLE(offset);
      retObj.houseOverdueFineForLayoutPerDay1 = retObj.houseOverdueFineForLayoutPerDay1.toFixed(1);
      offset += 4;
      log.trace('houseOverdueFineForLayoutPerDay1: ', retObj.houseOverdueFineForLayoutPerDay1);
      retObj.houseOverdueFineForLayoutPerDay2 = buf.readFloatLE(offset);
      retObj.houseOverdueFineForLayoutPerDay2 = retObj.houseOverdueFineForLayoutPerDay2.toFixed(1);
      offset += 4;
      log.trace('houseOverdueFineForLayoutPerDay2: ', retObj.houseOverdueFineForLayoutPerDay2);
      retObj.houseOverdueFineForLayoutPerDay3 = buf.readFloatLE(offset);
      retObj.houseOverdueFineForLayoutPerDay3 = retObj.houseOverdueFineForLayoutPerDay3.toFixed(1);
      offset += 4;
      log.trace('houseOverdueFineForLayoutPerDay3: ', retObj.houseOverdueFineForLayoutPerDay3);
      //物业费
      retObj.houseServicesChargesForLayoutPerMonth0 = buf.readFloatLE(offset);
      retObj.houseServicesChargesForLayoutPerMonth0 = retObj.houseServicesChargesForLayoutPerMonth0.toFixed(1);
      offset += 4;
      log.trace('houseServicesChargesForLayoutPerMonth0: ', retObj.houseServicesChargesForLayoutPerMonth0);
      retObj.houseServicesChargesForLayoutPerMonth1 = buf.readFloatLE(offset);
      retObj.houseServicesChargesForLayoutPerMonth1 = retObj.houseServicesChargesForLayoutPerMonth1.toFixed(1);
      offset += 4;
      log.trace('houseServicesChargesForLayoutPerMonth1: ', retObj.houseServicesChargesForLayoutPerMonth1);
      retObj.houseServicesChargesForLayoutPerMonth2 = buf.readFloatLE(offset);
      retObj.houseServicesChargesForLayoutPerMonth2 = retObj.houseServicesChargesForLayoutPerMonth2.toFixed(1);
      offset += 4;
      log.trace('houseServicesChargesForLayoutPerMonth2: ', retObj.houseServicesChargesForLayoutPerMonth2);
      retObj.houseServicesChargesForLayoutPerMonth3 = buf.readFloatLE(offset);
      retObj.houseServicesChargesForLayoutPerMonth3 = retObj.houseServicesChargesForLayoutPerMonth3.toFixed(1);
      offset += 4;
      log.trace('houseServicesChargesForLayoutPerMonth3: ', retObj.houseServicesChargesForLayoutPerMonth3);
      //水费
      retObj.houseWaterChargesPerTon = buf.readFloatLE(offset);
      retObj.houseWaterChargesPerTon = retObj.houseWaterChargesPerTon.toFixed(1);
      offset += 4;
      log.trace('houseWaterChargesPerTon: ', retObj.houseWaterChargesPerTon);
      //房间
      retObj.floorCount = 18;
      retObj.totalHouseCount = 0;
      retObj.totalExistsHouseCount = 0;
      retObj.totalTenantCount = 0;
      retObj.totalSubscriberCount = 0;
      retObj.floor = [16];
      for (let i = 0; i < 16; i++) {
        let floor = retObj.floor[i] = [80]
        floor.houseCount = 0;
        floor.existsHouseCount = 0;
        floor.tenantCount = 0
        floor.subscriberCount = 0
        for (let j=0; j < 80; j++) {
          let house = floor[j] = {}
          //房间号
          house.room = buf.readInt32LE(offset);
          offset += 4;
          //房间是否存在
          house.isExist = buf.readInt8(offset);
          offset += 1;
          if (house.isExist) {
            floor.houseCount = j+1;
            floor.existsHouseCount += 1;
            // log.debug('floor for :', i+1, 'house for: ', j+1)
            // log.trace('room: ', house.room);
            //房间型号
            house.roomNum = buf.readInt32LE(offset);
            offset += 4;
            // log.trace('roomNum: ', house.roomNum);
            //光线
            house.brightness = buf.readInt32LE(offset);
            offset += 4;
            // log.trace('brightness: ', house.brightness);
            //水表底数
            house.waterMeterEndNumber = buf.readInt32LE(offset);
            offset += 4;
            // log.trace('waterMeterEndNumber: ', house.waterMeterEndNumber);
            //电表底数
            house.electricMeterEndNumber = buf.readInt32LE(offset);
            offset += 4;
            // log.trace('electricMeterEndNumber: ', house.electricMeterEndNumber);
            //房间说明
            len = buf.readUInt32LE(offset);
            offset += 4
            if (len>0) {
              house.remark = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
            } else {
              house.remark = '';
            }
            // log.trace('remark: ', house.remark);
            //是否出租
            house.hasTenant = buf.readInt8(offset);
            offset += 1;
            if (house.hasTenant) {
              floor.tenantCount += 1
              // log.trace('has tenant:');
              let tenant = house.tenant = {}
              //姓名
              len = buf.readUInt32LE(offset);
              offset += 4
              tenant.name = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('name: ', tenant.name);
              //身份证
              len = buf.readUInt32LE(offset);
              offset += 4
              tenant.idNo = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('idNo: ', tenant.idNo);
              //手机
              len = buf.readUInt32LE(offset);
              offset += 4
              tenant.mobile = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('mobile: ', tenant.mobile);
              //押金
              tenant.deposit = buf.readFloatLE(offset);
              tenant.deposit = tenant.deposit.toFixed(1);
              offset += 4;
              // log.trace('deposit: ', tenant.deposit);
              //租金
              tenant.rental = buf.readFloatLE(offset);
              tenant.rental = tenant.rental.toFixed(1);
              offset += 4;
              // log.trace('rental: ', tenant.rental);
              //欠押金
              tenant.ownDeposit = buf.readFloatLE(offset);
              tenant.ownDeposit = tenant.ownDeposit.toFixed(1);
              offset += 4;
              // log.trace('ownDeposit: ', tenant.ownDeposit);
              //欠租金
              tenant.oweRental = buf.readFloatLE(offset);
              tenant.oweRental = tenant.oweRental.toFixed(1);
              offset += 4;
              // log.trace('oweRental: ', tenant.oweRental);
              //门卡数
              tenant.doorCardCount = buf.readInt32LE(offset);
              offset += 4;
              // log.trace('doorCardCount: ', tenant.doorCardCount);
              //合同开始
              // let year = buf.readInt32LE(offset);
              // offset += 4;
              // let month = buf.readInt32LE(offset)-1;
              // offset += 4;
              // let day = buf.readInt32LE(offset);
              // offset += 4;
              // let hour = buf.readInt32LE(offset);
              // offset += 4;
              // let minute = buf.readInt32LE(offset);
              // offset += 4;
              // let second = buf.readInt32LE(offset);
              // offset += 4;
              // tenant.contractStartDate = new Date(year, month, day, hour,minute, second)
              tenant.contractStartDate = readDate(buf, offset);
              offset += 24;
              // offset += longIntLength;
              // //合同结束
              // tenant.contractEndDate = buf.slice(offset, offset+8);
              // offset += longIntLength;
              tenant.contractEndDate = readDate(buf, offset);
              offset += 24;
              // //下次交租
              // tenant.rentalEndDate = buf.slice(offset, offset+8);
              // offset += longIntLength;
              tenant.rentalEndDate = readDate(buf, offset);
              offset += 24;
              // //下次交欠款
              // tenant.oweRentalExpiredDate = buf.slice(offset, offset+8);
              // offset += longIntLength;
              tenant.oweRentalExpiredDate = readDate(buf, offset);
              offset += 24;
            }
            house.hasSubscriber = buf.readInt8(offset);
            offset += 1;
            if (house.hasSubscriber) {
              floor.hasSubscriber += 1
              // log.trace('has subscriber:');
              let subscriber = house.subscriber = {}
              //姓名
              len = buf.readUInt32LE(offset);
              offset += 4
              subscriber.name = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('name: ', subscriber.name);
              //身份证
              len = buf.readUInt32LE(offset);
              offset += 4
              subscriber.idNo = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('idNo: ', subscriber.idNo);
              //手机
              len = buf.readUInt32LE(offset);
              offset += 4
              subscriber.mobile = iconv.convert(buf.slice(offset, offset+len)).toString();
              offset += len;
              // log.trace('mobile: ', subscriber.mobile);
              //定金
              subscriber.subscription = buf.readFloatLE(offset);
              subscriber.subscription = subscriber.subscription.toFixed(1);
              offset += 4;
              // log.trace('subscription: ', subscriber.subscription);
              // //定房时间
              // subscriber.createdAt = buf.slice(offset, offset+8);
              // offset += longIntLength;
              subscriber.createdAt = readDate(buf, offset);
              offset += 24;

              // //定房无效期
              // subscriber.expiredDate = buf.slice(offset, offset+8);
              // offset += longIntLength;
              subscriber.expiredDate = readDate(buf, offset);
              offset += 24;

            }
          }
        } 
        log.trace('floor for :', i+1, ';\t total count :', floor.houseCount, ';\t exists count :', floor.existsHouseCount, ';\t tenant count :', floor.tenantCount, ';\t subscriber count :', floor.subscriberCount);
        retObj.totalHouseCount += floor.houseCount;
        retObj.totalExistsHouseCount += floor.existsHouseCount;
        retObj.totalTenantCount += floor.tenantCount;
        retObj.totalSubscriberCount += floor.subscriberCount;
      };
      log.trace('mansion house total count :', retObj.totalHouseCount, ';\t house exists count :', retObj.totalExistsHouseCount, ';\t total tenant count: ', retObj.totalTenantCount, ';\t total subscription count: ', retObj.totalSubscriberCount);
    } else {
      log.error('file dose not exist');
      return retObj;
    }
  } catch(err) {
    log.error(err.name, err.message);
    retObj = {};
  }
  return retObj;
}
// loadRentFile();
exports.loadRentFile = loadRentFile;






