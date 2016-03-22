'use strict';

import log from '../utils/log';
import config from '../config';
import mongoose from 'mongoose';
import { Mail } from './mail'
import { AuthCodes } from './auth_codes'
import { Users, UsersTypes, UsersOmit, UsersPopulate, initUsers } from './users';
import { HouseLayoutPatterns, initHouseLayoutPatterns } from './mansion/house_layout_patterns';
import { Mansions, initMansions } from './mansion/mansions'
import { HouseLayouts, initHouseLayouts } from './mansion/house_layouts';

// mongoose.Promise = require('bluebird');

exports.connectDB = (env = {}) => {
  //connect database
  var database = config.database;
  if (process.env.NODE_ENV === 'test' || env.NODE_ENV === 'test') {
    database.db = database.db += '_test';
  }
  var dbURI = `mongodb://${database.user && database.password ? database.user + ':' + database.password : ''}${database.host}:${database.port}/${database.db}`;
  log.info(`mongo -- prepare connect to : ${database.host}:${database.port}/${database.db}`);
  mongoose.connect(dbURI);

  return new Promise((resolve, reject) => {
    mongoose.connection.on('open', () => {
      log.info(`mongo -- success connect to : ${database.host}:${database.port}/${database.db}`);
      resolve();
    }).on('error', (err) => {
      reject(err);
    })
  });
}

// reset database for test
let resetDatabase = () => {
  if (process.env.NODE_ENV === 'test') {
    return new Promise( (resolve, reject) => {
      mongoose.connection.db.dropDatabase(function (err) {
        if (err) {
          log.error('drop database err!', err.name, err.message);
          return reject(err);
        } else {
          log.info('drop database success!');
          return resolve();
        }
      });
    });
  } else {
    log.warn('reset database only exec in test env!');
    return Promise.resolve();
  }
}
exports.resetDatabase = resetDatabase;

/*
 * exports Model
 */
exports.Mail = Mail;
exports.AuthCodes = AuthCodes;

exports.Users = Users;
exports.UsersTypes = UsersTypes;
exports.UsersOmit = UsersOmit;
exports.UsersPopulate = UsersPopulate;

exports.HouseLayoutPatterns = HouseLayoutPatterns;
exports.Mansions = Mansions;
exports.HouseLayouts = HouseLayouts;

exports.init = async (clean, rebuiltRelationships) => {
  if (clean) {
    await resetDatabase();
  }

  await initUsers();
  await initHouseLayoutPatterns();  //初始化户型特征
  await initMansions();               //初始化大厦
  await initHouseLayouts();           //初始化户型

  //init relationships
  if (process.env.NODE_ENV === 'test' && (clean || rebuiltRelationships)) {
    log.info('mongo -- init relationship for all collections')
    let owner = await Users.findOne({email: '546113328@qq.com'}).exec();
    let mansion = await Mansions.findOne().exec();
    mansion.houseServicesChargesForLayoutPerMonth = {};
    mansion.houseOverdueFineForLayoutPerDay = {};

    mansion.ownerId = owner._id;
    mansion.managerIds = [owner._id];

    //为mansion绑定户型
    await HouseLayouts.update({}, {$set: {mansionsId: mansion._id}}).exec();

    //更新mansion各户型的物业费
    let houseLayouts = await HouseLayouts.find().sort({order: 1}).exec();

    await mansion.save()
  }
}














