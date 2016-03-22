'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'
import { refreshToken } from '../controllers/users';


router.put('/user/refreshToken', jwtVerify, refreshToken);

export default router;

