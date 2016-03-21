'use strict';

import _ from 'lodash'

exports.getMenusLinkByKey = function getMenusLink(parentMenu, menus, selectedKey) {
  var menusLink = null;
  for (var i = 0; i< menus.length; i++) {
    var menu = menus[i];
    if (menu.key===selectedKey) {
      menu =  _.assign({}, menu);
      menu._child_ = null;
      if (parentMenu) {
        parentMenu._child_ = menu;
        return parentMenu;
      } else {
        return menu;
      }
    } else {
      if (menu.menus && menus.length>0) {
        menusLink = getMenusLink(menu, menu.menus, selectedKey);
        if (menusLink) {
          if (parentMenu) {
            parentMenu._child_ = menusLink;
            return parentMenu;
          } else {
            return menusLink
          }
           
        }
      }
    }
  };
  return null;
}


exports.findMenuByKey = function findMenuByKey(menus, selectedKey) {
  for (var i = 0; i< menus.length; i++) {
    var menu = menus[i];
    if (menu.key===selectedKey) {
      return  _.assign({}, menu);
    } else {
      if (menu.menus && menus.length>0) {
        menu = findMenuByKey(menu.menus, selectedKey);
        if (menu) {
          return  _.assign({}, menu);
        }
      }
    }
  };
  return null;
}

// exports.findMenuByValue = function findMenuByValue(menus, selectedValue) {
//   for (var i = 0; i< menus.length; i++) {
//     var menu = menus[i];
//     if (menu.value===selectedValue) {
//       return  _.assign({}, menu);
//     } else {
//       if (menu.menus && menus.length>0) {
//         menu = findMenuByValue(menu.menus, selectedValue);
//         if (menu) {
//           return  _.assign({}, menu);
//         }
//       }
//     }
//   };
//   return null;
// }
