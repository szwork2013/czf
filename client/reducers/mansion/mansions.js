'use strict';

import _ from 'lodash'
import log from '../../utils/log'


import { GET_MANSIONS_SUCCESS, GET_MANSIONS_INFO_SUCCESS, ADD_MANSION_SUCCESS, DELETE_MANSION_SUCCESS } from '../../constants/actionTypes';



const initialState = {
  length: 0
};


export default (state = initialState, action) => {
  var newMansions = {}
  switch (action.type) {
    case GET_MANSIONS_SUCCESS:
      for (let mansion of action.resData.data.mansions) {
        newMansions[mansion._id] = mansion
      }
      newMansions.length = action.resData.data.mansions.length
      return newMansions
    case GET_MANSIONS_INFO_SUCCESS:
      newMansions = state
      let data = action.resData.data
      let mansion = state[data.mansionId]
      if (mansion) {
        mansion = _.assign({}, mansion)
        mansion.houses = data.houses
        mansion.shops = data.shops
        // mansion.houseLayouts = data.houseLayouts
        newMansions = _.assign({}, state)
        newMansions[data.mansionId] = mansion
      }
      return newMansions
    case ADD_MANSION_SUCCESS:
      newMansions = _.assign({}, state)
      newMansions[action.resData.data._id] = action.resData.data
      newMansions.length += 1
      return newMansions;
    case DELETE_MANSION_SUCCESS:
      newMansions = _.assign({}, state)
      delete newMansions[action.resData.data.id]
      newMansions.length -= 1
      return newMansions;
    default:
      return state;
  }
};

