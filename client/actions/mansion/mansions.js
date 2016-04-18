'use strict';

import { GET_MANSIONS_SUCCESS, GET_MANSIONS_INFO_SUCCESS, ADD_MANSION_SUCCESS, DELETE_MANSION_SUCCESS, 
         IMPORT_HISTORY_VERSION_DATA_SUCCESS,
         SAVE_MANSION_BASE_SUCCESS, SAVE_HOUSE_LAYOUTS_SUCCESS, 
         SAVE_HOUSES_SUCCESS, SAVE_FLOOR_SUCCESS, SAVE_MANAGERS_INFO_SUCCESS,
         HOUSE_CHECK_IN_SUCCESS, HOUSE_PAY_RENT_SUCCESS, HOUSE_SUBSCRIBE_SUCCESS, 
         HOUSE_REPAY_SUCCESS} from '../../constants/actionTypes';
import { CALL_API_V1 } from '../../middleware/api';
import { APP_STATE } from '../../reducers/master/app_state'

/*
 * 查询所有和管理的所有物业
 */
function requestMansions() {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_MANSIONS_SUCCESS
      },
      url: '/mansions/all',
      method: 'GET'
    }
  };
}
export function requestMansionsClick() {
  return dispatch => dispatch(requestMansions());
}

/*
 * 查询单个物业的详细
 */
function requestMansionInfo(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: GET_MANSIONS_INFO_SUCCESS
      },
      url: '/mansion/info',
      method: 'GET',
      data: formData
    }
  };
}
export function requestMansionInfoClick(formData) {
  return dispatch => dispatch(requestMansionInfo(formData));
}

/*
 * 新建单个物业
 */
function addMansion(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: ADD_MANSION_SUCCESS
      },
      url: '/mansion',
      method: 'POST',
      data: formData
    }
  };
}
export function addMansionClick(formData) {
  return dispatch => dispatch(addMansion(formData));
}


/*
 * 删除单个物业
 */
function deleteMansion(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: DELETE_MANSION_SUCCESS
      },
      url: '/mansion',
      method: 'DELETE',
      data: formData
    }
  };
}
export function deleteMansionClick(formData) {
  return dispatch => dispatch(deleteMansion(formData));
}

/*
 * 导入单个物业
 */
function importHistoryVersionData(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
         successType: IMPORT_HISTORY_VERSION_DATA_SUCCESS
      },
      url: '/mansion/history_version/data',
      method: 'PUT',
      data: formData,
      uploadFile: true
    }
  };
}
export function importHistoryVersionDataClick(formData) {
  return dispatch => dispatch(importHistoryVersionData(formData));
}


/*
 * 保存物业基本信息
 */
function saveMansionBase(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: SAVE_MANSION_BASE_SUCCESS
      },
      url: '/mansion/base',
      method: 'PUT',
      data: formData
    }
  }
}
export function saveMansionBaseClick(formData) {
  return dispatch => dispatch(saveMansionBase(formData));
}


/*
 * 保存户型
 */
function saveHouseLayouts(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: SAVE_HOUSE_LAYOUTS_SUCCESS
      },
      url: '/mansion/houseLayouts',
      method: 'PUT',
      data: formData
    }
  }
}
export function saveHouseLayoutsClick(formData) {
  return dispatch => dispatch(saveHouseLayouts(formData));
}

/*
 * 保存出租房信息
 */
function saveHouses(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: SAVE_HOUSES_SUCCESS
      },
      url: '/mansion/houses',
      method: 'PUT',
      data: formData
    }
  }
}
export function saveHousesClick(formData) {
  return dispatch => dispatch(saveHouses(formData));
}
function saveFloor(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: SAVE_FLOOR_SUCCESS
      },
      url: '/mansion/floor',
      method: 'PUT',
      data: formData
    }
  }
}
export function saveFloorClick(formData) {
  return dispatch => dispatch(saveFloor(formData));
}

function saveManagersInfo(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: SAVE_MANAGERS_INFO_SUCCESS
      },
      url: '/mansion/managersInfo',
      method: 'PUT',
      data: formData
    }
  }
}
export function saveManagersInfoClick(formData) {
  return dispatch => dispatch(saveManagersInfo(formData));
}


/*
 * 入住
 */
function houseCheckIn(formData) {
  return {
    [CALL_API_V1]: {
      actions: {
        successType: HOUSE_CHECK_IN_SUCCESS
      },
      url: '/mansion/house/checkin',
      method: 'POST',
      data: formData
    }
  }
}
export function houseCheckInClick(formData) {
  return dispatch => dispatch(houseCheckIn(formData));
}

/*
 * 交租
 */
function housePayRent(formData) {
return {
    [CALL_API_V1]: {
      actions: {
        successType: HOUSE_PAY_RENT_SUCCESS
      },
      url: '/mansion/house/payRent',
      method: 'POST',
      data: formData
    }
  }
}
export function housePayRentClick(formData) {
  return dispatch => dispatch(housePayRent(formData));
}

/*
 * 定房
 */
function houseSubscribe(formData) {
return {
    [CALL_API_V1]: {
      actions: {
        successType: HOUSE_SUBSCRIBE_SUCCESS
      },
      url: '/mansion/house/subscribe',
      method: 'POST',
      data: formData
    }
  }
}
export function houseSubscribeClick(formData) {
  return dispatch => dispatch(houseSubscribe(formData));
}
/*
 * 补欠款
 */
function houseRepay(formData) {
return {
    [CALL_API_V1]: {
      actions: {
        successType: HOUSE_REPAY_SUCCESS
      },
      url: '/mansion/house/repay',
      method: 'POST',
      data: formData
    }
  }
}
export function houseRepayClick(formData) {
  return dispatch => dispatch(houseRepay(formData));
}





