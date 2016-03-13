'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { generateAuthCode } from '../controllers/auth_codes';

/*
 * 生成验证码
 */
router.post('/authCode', generateAuthCode);

export default router;