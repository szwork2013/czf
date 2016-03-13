'use strict';

import Qiniu from 'qn';
import config from '../config';
var CDNConfig = config.CDN;



function Storage () {
}


var qn = Qiniu.create({
  accessKey: CDNConfig.accessKey,
  secretKey: CDNConfig.secretKey,
  bucket: CDNConfig.bucket,
  origin: CDNConfig.domain,
  // timeout: 3600000, // default rpc timeout: one hour, optional
  // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
  // uploadURL: 'http://up.qiniu.com/',
});

// var qnForPublic = Qiniu.create({
//   accessKey: config.Qiniu_AK,
//   secretKey: config.Qiniu_SK,
//   bucket: config.CDN_bucket_public,
//   domain: config.CDN_domain_public,
// });

Storage.Qiniu = {};


Storage.Qiniu.upload = (body, key) => {
    return new Promise(function(resolve, reject) {
        qn.uploadFile(body, {key: key}, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        })
    })
}

Storage.Qiniu.delete = (key) => {
    return new Promise(function(resolve, reject) {
        qn.delete(key, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        })
    })
}

// Storage.Qiniu.uploadForPublic = function(body, key) {
//     return new Promise(function(resolve, reject) {
//         qnForPublic.uploadFile(body, {key: key}, function(err, result) {
//             if (err) {
//                 return reject(err);
//             } else {
//                 return resolve(result);
//             }
//         })
//     })
// }

Storage.Qiniu.downloadToken = (key) => {
    let subUrl = key[0] == '/' ? key.substr(1) : key;
    let expire = Math.round(Date.now() / 1000) + 3600;
    let url = CDNConfig.domain + '/' + subUrl + '?e=' + expire;
    // var url = qn.resourceURL(key) + '?e=' + expire;
    let token = qn.downloadToken(url);
    return {
        token: token,
        expire: expire,
        url: url
    };
}
Storage.Qiniu.downloadURL = (key) => {
    let obj = Storage.Qiniu.downloadToken(key);
    var url = obj.url + "&token=" +obj.token
    return {
        url: url
    };
}

Storage.Qiniu.uploadToken = () => {
    var options = {}
    options.deadline = Math.round(Date.now() / 1000) + 3600;
    let token = qn.uploadToken(options);
    return {
        token: token,
        deadline: options.deadline,
        url: CDNConfig.uploadDomain
    };
}


Storage.Qiniu.getUploadToken = (key) => {

}

/*
    common
*/
Storage.save = async (key, body) => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    var rel = null;
    if (CDNConfig.name === 'Qiniu') {
        rel = await Storage.Qiniu.upload(body, key);
    } else {
        console.error('Undefined CDN:', config.CDN);
        throw new Error('Undefined CDN:', config.CDN);
    }
    return rel;
}




/*
    common
*/
Storage.delete = async (key) => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    var rel = null;
    if (CDNConfig.name === 'Qiniu') {
        rel = await Storage.Qiniu.delete(key);
    } else {
        console.error('Undefined CDN:', config.CDN);
        throw new Error('Undefined CDN:', config.CDN);
    }
    return rel;
}




export default Storage;




