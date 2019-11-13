import { Response } from '../helpers/utils';
import { STATUS, TRANSACTION } from '../helpers/constants';
import models from '../database/models';

const { Transaction } = models;

export const getAccountBalance = async (accountNumber) => {
  try {
    const debits = await Transaction.getTotal(
      accountNumber,
      TRANSACTION.TYPE_DEBIT,
      TRANSACTION.STATUS_SUCCESS,
    );
    const credits = await Transaction.getTotal(
      accountNumber,
      TRANSACTION.TYPE_CREDIT,
      TRANSACTION.STATUS_SUCCESS,
    );

    const balance = credits - debits;

    return {
      balance,
      credits,
      debits,
    };
  } catch (error) {
    return null;
  }
};

export const validateAccountBalance = async (request, response, next) => {
  const { accountNumber } = request.params;
  const { amount, type } = request.body;

  if (type === TRANSACTION.TYPE_CREDIT) {
    return next();
  }

  const { balance } = await getAccountBalance(accountNumber);
  if (amount > balance) {
    return Response.send(
      response,
      STATUS.UNPROCESSED,
      [],
      'Insufficient funds',
      false,
    );
  }
  next();
};

export default {};
