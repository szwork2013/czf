'use strict';

exports.Session = (() => {
  return {
    'set': (key, value) => {
      value = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, value);
    },

    'get': (key, type='string') => {
      let value = sessionStorage.getItem(key);
      return type === 'string' ? value : JSON.parse(value);
    },

    'remove': (key) => {
      sessionStorage.removeItem(key);
    },

    'clear': () => {
      sessionStorage.clear();
    }
  };

})();
