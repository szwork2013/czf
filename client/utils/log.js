'use strict';

import myDebug from 'debug'

localStorage.debug = 'czf:*'
// localStorage.debug = '-sockjs-client'

var log = {};

let levels = [{
    name: 'trace',
    color: 'lightseagreen'
  }, {
    name: 'debug',
    color: 'dodgerblue'
  }, {
    name: 'info',
    color: 'forestgreen'
  }, {
    name: 'warn',
    color: 'goldenrod'
  }, {
    name: 'error',
    color: 'crimson'
  },  {
    name: 'fatal',
    color: 'darkorchid'
  }
];

levels.forEach( level => {
  log[level.name] = myDebug(`czf:${level.name}:`);
  log[level.name].color = level.color;
});

let myDebugPrefix = 'czf'
const setLever = log.setLever = (name) => {
  let ret = ''
  let level = ''
  for (var i = levels.length - 1; i >= 0; i--) {
    level = levels[i];
    ret = ret + myDebugPrefix + ':' + level.name + ':*,';
    if (level.name === name) break;
  };
  ret = ret.substr(0, ret.length-1);
  localStorage.debug = ret;
}

export default log