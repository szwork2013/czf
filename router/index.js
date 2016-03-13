'use strict';

import path from 'path';
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

import authCodes from './auth_codes';
import accounts from './accounts';

router.use('/api/v1', [authCodes, accounts]);


module.exports = router;