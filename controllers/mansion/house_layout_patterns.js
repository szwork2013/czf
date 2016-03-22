'use strict';

import log from '../../utils/log';
import _ from 'lodash';
import utils from '../../utils';
import config from '../../config';


import { HouseLayoutPatterns } from '../../models';


/*
 * 取得基础户型
 */
const getHouseLayoutPatterns = async (req, res) => {
  let houseLayoutPatterns = await HouseLayoutPatterns.find().exec();
  return res.handleResponse(200, {houseLayoutPatterns});
}
exports.getHouseLayoutPatterns = getHouseLayoutPatterns;


