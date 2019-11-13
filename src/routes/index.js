import express from 'express';
import usersRoute from './users';
import transactionsRoute from './transactions';
import banksRoute from './banks';

import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';

const router = express.Router();

router.use('/users', usersRoute);

router.use('/transactions', transactionsRoute);

router.use('/banks', banksRoute);

router.all('*', (request, response) => {
  Response.send(response, STATUS.NOT_FOUND, null, MESSAGE.NOT_FOUND, false);
});

export default router;
