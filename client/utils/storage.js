'use strict';

exports.Storage = (() => {
  return {
    'set': (key, value) => {
      value = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, value);
    },

    'get': (key, type='string') => {
      let value = localStorage.getItem(key);
      return type === 'string' ? value : JSON.parse(value);
    },

    'remove': (key) => {
      localStorage.removeItem(key);
    },

    'clear': () => {
      localStorage.clear();
    }
  };

})();
