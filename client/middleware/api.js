'use strict';

import _ from 'lodash'
import jquery from 'jquery'
import fetch from 'isomorphic-fetch';

import { loadingOn, loadOff } from '../actions/loading';
import { openToast } from '../actions/toast';
import { Session } from '../utils/session';
export const CALL_API_V1 = Symbol('Call API V1');

const toLowerCaseKeys = (obj, types = ['string'], isExclude = false) => {
  if (!obj) return obj;
  let retObj = {};
  types = Array.prototype.slice.apply(types);
  isInclude = !isExcluder;
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
  const callAPIV1 = action[CALL_API_V1];

  if (!callAPIV1) {
    return next(action);
  };

  //取参数
  let { url, method, data, headers, actions, manualLoading, manualResponse } = callAPI;
  const { requestType, successType, failureType, responseType } = actions;

  //根据请求API为url加前缀
  if (callAPIV1) {
    url = '/api/v1' + url;
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  //prepare to require
  if (requestType) {
    next(actionWith({ type: requestType }));
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
      next(actionWith(resObj));
    } else {
      if (resObj.resStatus === 200) {
        resObj.type = successType;
        next(actionWith(resObj));
      } else {
        let msg = 'unknow error!'
        let status = 500
        if (resObj.resData && resObj.resData.msg) msg = resObj.resData.msg;
        if (resObj.resStatus) status = resObj.resStatus;
        next(openToast({status: status, msg: msg}));
      }
    }
  }).catch( error => {
    //auto loading off
    if (!manualLoading) {
      next(loadingOff());
    }
    resObj.error = error
    if (manualResponse) {
      //treat response manual
      resObj.type = responseType;
    } else {
      resObj.type = failureType; 
    }
    next(actionWith(resObj));
  })

};