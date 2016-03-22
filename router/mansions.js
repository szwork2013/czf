'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'

import { getHouseLayoutPatterns } from '../controllers/mansion/house_layout_patterns'
// import { ownMansions } from '../controllers/mansion/mansions';

router.get('/mansions/houseLayoutPatterns', jwtVerify, getHouseLayoutPatterns);

// router.get('/mansions/own', jwtVerify, ownMansions);

export default router;

