'use strict';
import log from '../utils/log';

var treatCode = (code) => {
  switch(code) {
    case 200: {return 'OK'; break;}
    case 202: {return 'Accepted'; break;}
    
    case 400: {return 'Bad Request'; break;}                      //请求参数缺失、参数格式错误、参数取值非法等
    case 401: {return 'Unauthorized'; break;}                     //请求头未带authorization信息、 authorization非法等
    case 403: {return 'Forbidden'; break;}                        //authorization验证通过，但无权限操作指定的资源
    case 404: {return 'Not Found'; break;}                        //所查找的文件不存在、数据记录不存在等
    case 409: {return 'Conflict'; break;}                         //手机、邮箱、上传文件key等唯一性信息重复
    case 410: {return 'Gone'; break;}                             //原本定义的东西已不可用，例如某API接口不再支持
    case 415: {return 'Unsupported Media Type'; break;}           //上传的文件格式不正确等
    case 416: {return 'Requested Range Not Satisfiable'; break;}  //所设置的状态位不存在 
    case 429: {return 'Too Many Requests'; break;}                //频繁获取手机验证码

    case 500: {return 'Internal Server Error'; break;}            //服务器异常
    case 502: {return 'Bad Gateway'; break;}                      //第三方服务异常，短信接口异常  
  }
}

var handleResponse = (req, res, next) => {
  if (!res.handleResponse){
    res.handleResponse = function (status=200, data={}, msg='') {
      if (!msg) {
        msg = treatCode(status);
      }

      res.status(status);
      res.json({
        msg: msg,
        data: data
      });
      
      // log.debug('this.body:', this.body.code, this.body.msg, this.body.data);
      log.trace(`status=${status};`, `msg='${msg}';`, `data=`, data);
    }
  }
  next();
}

export default handleResponse;