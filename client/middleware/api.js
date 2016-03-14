'use strict';

import log from '../utils/log'
import _ from 'lodash'
import jquery from 'jquery'
import fetch from 'isomorphic-fetch';

import { loadingOn, loadingOff } from '../actions/loading';
import { openToast } from '../actions/toast';
import { Session } from '../utils/session';

export const CALL_API = Symbol('Call API');
export const CALL_API_V1 = Symbol('Call API V1');

const toLowerCaseKeys = (obj, types = ['string'], isExclude = false) => {
  if (!obj) return obj;
  let retObj = {};
  types = Array.prototype.slice.apply(types);
  let isInclude = !isExclude;
  Object.getOwnPropertyNames(obj).forEach((key) => {
    var value = obj[key];
    var inType = types.indexOf(typeof value) > -1;
    if (isInclude&&inType) {
        retObj[key.toString().toLowerCase()] = value;
    } else {
      retObj[key] = value;
    }
  });
  return retObj;
}

/*
 * method : it is a byte-case-insensitive match for `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, or `PUT`, byte-uppercase it.
 */
function callApi(url, method = 'POST', data = {}, headers = {}) {
  headers = Object.assign({
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': Session.get('token')
    }, toLowerCaseKeys(headers));

  let options = {
    method,
    headers
  };

  let contentType = headers['content-type'].toLowerCase();
  if (contentType === 'application/json') {
    options.body = JSON.stringify(data);
  } else if (contentType === 'form-data') {
    options.body = data
  } else if (contentType === 'application/x-www-form-urlencoded') {
    var query = jquery.param(data);
    if (url.indexOf('?') > -1) {
      url += `&${query}`
    } else {
      url += `?${query}`
    }
  }

  return fetch(url, options)
    .then(response => {
      let acceptType = headers['accept'].toLowerCase()
      if (acceptType === 'application/json') {
        return response.json().then( json => { 
          return { resType: 'json', resData: json, resStatus: response.status, response}
        });
      } else if (acceptType.indexOf('text/') === 0) {
        return response.text().then( text => {
          return { resType: 'text', resData: text, resStatus: response.status, response}
        });
      } else {
        return response.blob().then( blob => {
          return { resType: 'blob', resData: blob, resStatus: response.status, response}
        });
      }
    })
}

/*
 * 声明中间件
 */
export default store => next => action => {
  const callAPI = action[CALL_API];
  const callAPIV1 = action[CALL_API_V1];
  var callSymbol = null

  //取参数
  if (callAPI) {
    callSymbol = CALL_API;
    var { url, method, data, headers, actions, manualLoading, manualResponse } = callAPI;
  } else if (callAPIV1) {
    callSymbol = CALL_API_V1;
    var { url, method, data, headers, actions, manualLoading, manualResponse } = callAPIV1;
    url = '/api/v1' + url;
  } else {
    return next(action);
  }
  const { requestType, successType, failureType, responseType } = actions;

  //根据请求API为url加前缀

  function actionWith(data, callSymbol = CALL_API) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[callSymbol];
    return finalAction;
  }

  //prepare to require
  if (requestType) {
    next(actionWith({ type: requestType }, callSymbol));
  }

  //auto loading on
  if (!manualLoading) {
    next(loadingOn());
  }

  return callApi(url, method, data, headers).then( resObj => {
    //auto loading off
    if (!manualLoading) {
      next(loadingOff());
    }
    //treat response manual
    if (manualResponse) {
      resObj.type = responseType;
      next(actionWith(resObj, callSymbol));
    } else {
      if (resObj.resStatus === 200) {
        resObj.type = successType;
        next(actionWith(resObj, callSymbol));
      } else if (failureType) {
        resObj.type = failureType; 
        next(actionWith(resObj, callSymbol));
      } else {
        let msg = 'unknow error!'
        let status = 500
        if (resObj.resData && resObj.resData.msg) msg = resObj.resData.msg;
        if (resObj.resStatus) status = resObj.resStatus;
        next(openToast({status: status, msg: msg}));
      }
    }
  }).catch( error => {
    log.info(error);
    let resObj = {resType: 'error', resData: error, resStatus: 500}
    //auto loading off
    if (!manualLoading) {
      next(loadingOff());
    }
    if (manualResponse) {
      //treat response manual
      resObj.type = responseType;
      next(actionWith(resObj, callSymbol));
    } else if (failureType) {
      resObj.type = failureType; 
      next(actionWith(resObj, callSymbol));
    } else {
      let msg = error.name + '[' + error.message + ']';
      let status = 500
      if (resObj.resData && resObj.resData.msg) msg = resObj.resData.msg;
      if (resObj.resStatus) status = resObj.resStatus;
      next(openToast({status: status, msg: msg}));
    }
  })

};