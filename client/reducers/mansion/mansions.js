'use strict';

import _ from 'lodash'
import log from '../../utils/log'


import { SIGNOUT, GET_MANSIONS_SUCCESS, GET_MANSIONS_INFO_SUCCESS, ADD_MANSION_SUCCESS, 
  DELETE_MANSION_SUCCESS, IMPORT_HISTORY_VERSION_DATA_SUCCESS,
  SAVE_MANSION_BASE_SUCCESS, SAVE_HOUSE_LAYOUTS_SUCCESS,
  SAVE_HOUSES_SUCCESS, SAVE_FLOOR_SUCCESS, SAVE_MANAGERS_INFO_SUCCESS,
  HOUSE_CHECK_IN_SUCCESS, HOUSE_PAY_RENT_SUCCESS, HOUSE_SUBSCRIBE_SUCCESS,
  HOUSE_REPAY_SUCCESS, HOUSE_UNSUBSCRIBE_SUCCESS, HOUSE_CHECK_OUT_SUCCESS } from '../../constants/actionTypes';



const initialState = {
  length: 0
};
function findHouseIdx(houses = [], houseRet) {
  return houses.findIndex( house => {
    return house.floor===houseRet.floor && house.room===houseRet.room
  })
}

export default (state = initialState, action) => {
  var newMansions = {}
  var mansion = {}
  var houses = []
  var data = {}
  var mansionRet = {};
  var houseRet = {}

  switch (action.type) {
    case GET_MANSIONS_SUCCESS:                  //取得全部
      for (let mansion of action.resData.data.mansions) {
        newMansions[mansion._id] = mansion
      }
      newMansions.length = action.resData.data.mansions.length
      return newMansions
    case GET_MANSIONS_INFO_SUCCESS:             //取得详细
      newMansions = state
      data = action.resData.data
      mansion = state[data.mansionId]
      if (mansion) {
        mansion = _.assign({}, mansion)
        if (data.managersInfo)
          mansion.managersInfo = data.managersInfo
        if (data.houseLayouts)
          mansion.houseLayouts = data.houseLayouts
        if (data.houses) 
          mansion.houses = data.houses
        if (data.shops)
          mansion.shops = data.shops
        newMansions = _.assign({}, state)
        newMansions[data.mansionId] = mansion
      }
      return newMansions
    case ADD_MANSION_SUCCESS:                     //增加
      newMansions = _.assign({}, state)
      newMansions[action.resData.data._id] = action.resData.data
      newMansions.length += 1
      return newMansions;
    case DELETE_MANSION_SUCCESS:                  //册除
      newMansions = _.assign({}, state)
      delete newMansions[action.resData.data.id]
      newMansions.length -= 1
      return newMansions;

    //导入
    case IMPORT_HISTORY_VERSION_DATA_SUCCESS:
      newMansions = _.assign({}, state)
      newMansions[action.resData.data._id] = action.resData.data
      return newMansions

    //保存
    case SAVE_MANSION_BASE_SUCCESS:               //保存基本信息
      newMansions = _.assign({}, state)
      mansionRet = action.resData.data.mansion
      newMansions[mansionRet._id] = _.assign({}, newMansions[mansionRet._id], mansionRet)
      return newMansions;
    case SAVE_HOUSE_LAYOUTS_SUCCESS:              //保存户型
      newMansions = _.assign({}, state)
      newMansions[action.resData.data.mansionId].houseLayouts = action.resData.data.houseLayouts
      return newMansions

    case SAVE_HOUSES_SUCCESS:
    case SAVE_FLOOR_SUCCESS:
      newMansions = _.assign({}, state)
      mansionRet = action.resData.data.mansion
      newMansions[mansionRet._id] = _.assign({}, newMansions[mansionRet._id], mansionRet)
      newMansions[mansionRet._id].houses = action.resData.data.houses
      return newMansions

    case SAVE_MANAGERS_INFO_SUCCESS:
      newMansions = _.assign({}, state)
      mansionRet = action.resData.data.mansion
      newMansions[mansionRet._id] = _.assign({}, newMansions[mansionRet._id], mansionRet)
      newMansions[mansionRet._id].managersInfo = action.resData.data.managersInfo
      return newMansions

    case HOUSE_CHECK_IN_SUCCESS:
    case HOUSE_PAY_RENT_SUCCESS:
    case HOUSE_SUBSCRIBE_SUCCESS:
    case HOUSE_REPAY_SUCCESS:
    case HOUSE_UNSUBSCRIBE_SUCCESS:
    case HOUSE_CHECK_OUT_SUCCESS:
      newMansions = _.assign({}, state)
      data = action.resData.data
      mansion = newMansions[data.mansionId]
      houseRet = action.resData.data.house
      var idx = findHouseIdx(mansion.houses, houseRet)
      if (idx>-1) {
        mansion.houses[idx] = houseRet
      }
      return newMansions

    case SIGNOUT:
      return initialState

    default:
      return state;
  }
};

