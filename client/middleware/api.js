'use strict';

import log from '../utils/log'
import _ from 'lodash'
import jquery from 'jquery'
import fetch from 'isomorphic-fetch';

import { loadingOn, loadingOff } from '../actions/master/loading';
import { openToast } from '../actions/master/toast';
import { Storage } from '../utils/storage';

import { browserHistory } from 'react-router';
import download from '../utils/download.js'

import { USER_RESTORE } from '../constants/actionTypes';

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
function callApi(url, method = 'POST', data = {}, headers = {}, uploadFile = false) {
  let state = window.defaultStore.getState() || {};
  let user = state.user || {};
  let token = user.token;
  let defaultHeaders = {
      'accept': 'application/json',
      // 'content-type': method.toUpperCase() === 'GET'? 'application/x-www-form-urlencoded': 'application/json',
      'authorization': token
    };
  headers = _.assign(defaultHeaders, toLowerCaseKeys(headers));
  let options = {
    method,
    headers
  };

  if (method.toUpperCase() === 'GET') {
    options.headers['content-type'] = 'application/x-www-form-urlencoded'
    var query = jquery.param(data);
    if (url.indexOf('?') > -1) {
      url += `&${query}`
    } else {
      url += `?${query}`
    }
  } else {
    if (uploadFile) {
      var formData = new FormData()
      for (var key in data) {
        formData.append(key, data[key])
      }
      options.body = formData
      options.contentType = false
    } else {
      options.headers['content-type'] = 'application/json'
      options.body = JSON.stringify(data)
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
    var { url, method, data, headers, actions, manualLoading, manualResponse, uploadFile, downloadFile } = callAPI;
  } else if (callAPIV1) {
    callSymbol = CALL_API_V1;
    var { url, method, data, headers, actions, manualLoading, manualResponse, uploadFile, downloadFile } = callAPIV1;
    url = '/api/v1' + url;
  } else {
    return next(action);
  }
  actions = actions || {}
  const { requestType, successType, failureType, responseType } = actions;

  //根据请求API为url加前缀

  function actionWith(data, callSymbol = CALL_API) {
    const finalAction = _.assign({}, action, data);
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

  return callApi(url, method, data, headers, uploadFile).then( resObj => {
    //auto loading off
    if (!manualLoading) {
      next(loadingOff());
    }
    //treat response manual
    if (manualResponse) {
      if (responseType) {
        resObj.type = responseType;
        next(actionWith(resObj, callSymbol));
      }
    } else {
      if (resObj.resStatus === 401) {
        window.defaultStore.dispatch({type: USER_RESTORE, token: '', expiresIn: new Date()})
        Storage.remove('token');
        Storage.remove('expiresIn');
        browserHistory.push('/signin');
        return
      }
      else if (resObj.resStatus === 200) {
        if (resObj.resType==='blob' && downloadFile) {
          var filename = ''
          var contentDisposition = resObj.response.headers.get('content-disposition')
          if (!_.isEmpty(contentDisposition)) {
            var filenameRegExp = /filename=[\"]*(.*)[\"]*/gi;
            filename = filenameRegExp.exec(contentDisposition);
            if (filename && filename.length>1) {
              filename = filename[1]
            } else {
              filename = ''
            }
          }
          if (_.isEmpty(filename)) {
            filename = (new Date()).getTime().toString()
            var contentType = resObj.response.headers.get('content-type')
            if (!_.isEmpty(contentType)) {
              filename += '.'+contentType.split('/')[1]
            }
          }
          download(resObj.resData, filename)
        }
        if (successType) {
          resObj.type = successType;
          next(actionWith(resObj, callSymbol));
        }
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
    let resObj = {resType: 'error', resData: error, resStatus: 500}
    //auto loading off
    if (!manualLoading) {
      next(loadingOff());
    }
    if (manualResponse) {
      //treat response manual
      if (responseType) {
        resObj.type = responseType;
        next(actionWith(resObj, callSymbol));
      }
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