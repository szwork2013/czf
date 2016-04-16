'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'
import { mansionVerify } from '../middlewares/mansion_verify'

import { getHouseLayoutPatterns } from '../controllers/mansion/house_layout_patterns'
import { mansionsAll, mansionInfo, addMansion, deleteMansion, importHistoryVersionData,
         saveMansionBase, saveHouseLayouts, saveFloor, saveManagersInfo } from '../controllers/mansion/mansions';

import { houseCheckIn, housePayRent } from '../controllers/mansion/houses';

var multer  = require('multer')
var upload = multer({ dest: 'uploads/temp/' })

router.get('/mansions/houseLayoutPatterns', jwtVerify, getHouseLayoutPatterns);

router.get('/mansions/all', jwtVerify, mansionsAll);

router.get('/mansion/info', jwtVerify, mansionVerify, mansionInfo);

router.post('/mansion', jwtVerify, addMansion);
router.delete('/mansion', jwtVerify, deleteMansion);
router.put('/mansion/history_version/data', jwtVerify, upload.single('file'), importHistoryVersionData);
router.put('/mansion/base', jwtVerify, saveMansionBase);
router.put('/mansion/houseLayouts', jwtVerify, saveHouseLayouts);
router.put('/mansion/floor', jwtVerify, saveFloor);
router.put('/mansion/managersInfo', jwtVerify, saveManagersInfo);


router.post('/mansion/house/checkin', jwtVerify, houseCheckIn);
router.post('/mansion/house/payRent', jwtVerify, housePayRent);

export default router;

