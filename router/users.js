'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'
import { refreshToken, getUser } from '../controllers/users';


router.put('/user/refreshToken', jwtVerify, refreshToken);
router.get('/user', jwtVerify, getUser);

export default router;

