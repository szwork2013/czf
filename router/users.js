'use strict';

import log from '../utils/log';
import express from 'express';
const router = express.Router();

import { jwtVerify } from '../middlewares/jwt_verify'
import { getSelf } from '../controllers/users';


router.get('/user/self', jwtVerify, getSelf);

export default router;

