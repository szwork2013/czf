'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'
import { mansionVerify } from '../middlewares/mansion_verify'

import { getHouseLayoutPatterns } from '../controllers/mansion/house_layout_patterns'
import { mansionsAll, mansionInfo } from '../controllers/mansion/mansions';

router.get('/mansions/houseLayoutPatterns', jwtVerify, getHouseLayoutPatterns);

router.get('/mansions/all', jwtVerify, mansionsAll);

router.get('/mansion/info', jwtVerify, mansionVerify, mansionInfo);

export default router;

