'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { createAccount, confirmEmail, signinMobileWithAuthCode, signinWithPwd } from '../controllers/accounts';

/*
 * 生成验证码
 */
router.post('/account', createAccount);

router.get('/mail/confirm', confirmEmail);

router.post('/signin/mobile', signinMobileWithAuthCode);

router.post('/signin/name', signinWithPwd);

export default router;

