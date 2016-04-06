'use strict';

import _ from 'lodash'
import log from '../../utils/log'


import { SIGNOUT, GET_MANSIONS_SUCCESS, GET_MANSIONS_INFO_SUCCESS, ADD_MANSION_SUCCESS, 
  DELETE_MANSION_SUCCESS, IMPORT_HISTORY_VERSION_DATA_SUCCESS,
  SAVE_MANSION_BASE_SUCCESS, SAVE_HOUSE_LAYOUTS_SUCCESS,
  SAVE_HOUSES_SUCCESS, SAVE_FLOOR_SUCCESS, SAVE_MANAGERS_INFO_SUCCESS } from '../../constants/actionTypes';



const initialState = {
  length: 0
};


export default (state = initialState, action) => {
  var newMansions = {}
  var mansionRet = {};
  switch (action.type) {
    case GET_MANSIONS_SUCCESS:                  //取得全部
      for (let mansion of action.resData.data.mansions) {
        newMansions[mansion._id] = mansion
      }
      newMansions.length = action.resData.data.mansions.length
      return newMansions
    case GET_MANSIONS_INFO_SUCCESS:             //取得详细
      newMansions = state
      let data = action.resData.data
      let mansion = state[data.mansionId]
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

    case SIGNOUT:
      return initialState

    default:
      return state;
  }
};

