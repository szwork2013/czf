'use strict';
var IDArea, IDRegular, IDValideCode, IDWi;
IDArea = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
};
IDRegular = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
IDValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
IDWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];

function IDGetLocation(id) {
  var e;
  try {
    return IDArea[parseInt(id.substr(0, 2))];
  } catch (_error) {
    e = _error;
    return null;
  }
};
exports.IDGetLocation = IDGetLocation

function IDGetYear(id) {
  id = id.toString();
  if (id.length === 15) {
    return parseInt('19' + id.substring(6, 8));
  } else if (id.length === 18) {
    return parseInt(id.substring(6, 10));
  } else {
    return null;
  }
};
exports.IDGetYear = IDGetYear

function IDGetMonth(id) {
  id = id.toString();
  if (id.length === 15) {
    return parseInt(id.substring(8, 10));
  } else if (id.length === 18) {
    return parseInt(id.substring(10, 12));
  } else {
    return null;
  }
};
exports.IDGetMonth = IDGetMonth

function IDGetDate(id) {
  id = id.toString();
  if (id.length === 15) {
    return parseInt(id.substring(10, 12));
  } else if (id.length === 18) {
    return parseInt(id.substring(12, 14));
  } else {
    return null;
  }
};
exports.IDGetDate = IDGetDate

function IDGetBirthday(id) {
  var d, m, y;
  y = IDGetYear(id);
  m = IDGetMonth(id) - 1;
  d = IDGetDate(id);
  if (y !== null && m !== null && d !== null) {
    return new Date(y, m, d);
  }
  return null;
};
exports.IDGetBirthday = IDGetBirthday

function IDGetAge(id) {
  var age, d, m, now, y;
  now = new Date();
  y = IDGetYear(id);
  m = IDGetMonth(id) - 1;
  d = IDGetDate(id);
  if (y !== null && m !== null && d !== null) {
    age = now.getFullYear() - y - 1;
    if (m < now.getMonth() || m === now.getMonth() && d <= now.getDate()) {
      age++;
    }
    return age;
  }
  return null;
};
exports.IDGetAge = IDGetAge

function IDGetGender(id) {
  var gender;
  id = id.toString();
  if (id.length === 15) {
    gender = id.substring(13, 14);
    if (gender % 2 === 0) {
      return 2;
    }
    return 1;
  } else if (id.length === 18) {
    gender = id.substring(16, 17);
    if (gender % 2 === 0) {
      return 2;
    }
    return 1;
  } else {
    return null;
  }
};
exports.IDGetGender = IDGetGender
function IDGetGenderCN(id) {
  var gender = IDGetGender(id)
  switch (gender) {
    case 1: return '男'
    case 2: return '女'
    default: return null
  }
}
exports.IDGetGenderCN = IDGetGenderCN

function IDIsValid(id) {
  id = id.toString();
  if (!IDRegular.test(id)) {
    return false;
  }
  if (id.length !== 15 && id.length !== 18) {
    return false;
  }
  if (!IDGetLocation(id)) {
    return false;
  }
  if (!IDIsValidBirthday(id)) {
    return false;
  }
  if (id.length === 18) {
    return IDIsValid18End(id);
  }
  return true;
};
exports.IDIsValid = IDIsValid

function IDIsValidBirthday(id) {
  var birthday, d, m, y;
  y = IDGetYear(id);
  m = IDGetMonth(id) - 1;
  d = IDGetDate(id);
  birthday = IDGetBirthday(id);
  if (y === birthday.getFullYear() && m === birthday.getMonth() && d === birthday.getDate()) {
    return true;
  }
  return false;
};
exports.IDIsValidBirthday = IDIsValidBirthday

function IDIsValid18End(id) {
  var end, i, pos, sum, _i;
  id = id.toString();
  sum = 0;
  if (id[17].toLowerCase() === 'x') {
    end = 10;
  } else {
    end = parseInt(id[17]);
  }
  for (i = _i = 0; _i < 17; i = ++_i) {
    sum += IDWi[i] * id[i];
  }
  pos = sum % 11;
  if (end === IDValideCode[pos]) {
    return true;
  }
  return false;
};
exports.IDIsValid18End = IDIsValid18End

// function pad(num, len=0) {
//   var str = num.toString();
//   var zero = ''
//   for (var i = str.length; i<len; i++) {
//     zero += '0'
//   };
//   return zero+str;
// }
// function tryNumber() {
//   var pre = '4452811989'
//   var tai = '0024'
//   var count = 0
//   for (var i = 1; i<=12; i++) {
//     for (var j=1; j<=31; j++) {
//       var month = pad(i, 2);
//       var day = pad(j, 2);
//       var no = pre+month+day+tai;
//       if (IDIsValid(no)) {
//         count++;
//         console.log(no);
//       }
//     }
//   }
//   console.log(count);
// }
// tryNumber()