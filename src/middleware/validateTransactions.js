import {
  validateRequired,
  validateNumber,
  validateFloat,
  validateOptional,
  validateDigits,
  validateEmail,
} from './validatorHelpers';
import { Response } from '../helpers/utils';
import { STATUS, TRANSACTION, MESSAGE } from '../helpers/constants';
import models from '../database/models';

const { Transaction } = models;

export const validateTransactionDetails = [
  validateFloat('amount', 'Amount must be a valid number'),
  validateNumber(
    'transactionDate',
    'Transaction date is required',
    0,
    Number.MAX_SAFE_INTEGER,
  ),
];

export const validateTransactionCustomerDetails = [
  ...validateTransactionDetails,
  validateRequired('receiverBank', "Beneficiary's bank is required"),
  validateRequired('receiverName', "Beneficiary's name is required"),
  validateRequired('receiverEmail', "Beneficiary's email is required"),
  validateEmail('receiverEmail', "Enter a valid beneficiary's email"),
  validateDigits(
    'receiverAccount',
    "Enter a valid beneficiary's acccount number",
  ),
  validateNumber('option', 'Transaction option is required', 0, 1),
  validateRequired('receiverPhone', "Beneficiary's phone is required"),
  validateRequired('pin'),
];

export const validateAccountNumber = [
  validateDigits('accountNumber', 'Enter a valid acccount number'),
];

export const validateTransactionType = [
  validateNumber('type', 'Transaction type is required', 0, 1),
];

export const validateBankId = [
  validateNumber('bankId', 'Enter a valid bank ID'),
];

export const validateTransactionStatus = [
  validateNumber('status', 'Transaction status is required', 0, 2),
];

export const validateTransactionActivationCode = [
  validateNumber('activationCode', 'OTP must be a 4 digit number', 1000, 9999),
];

export const validateTransferRestrictions = (request, response, next) => {
  const { userIsAdmin } = response.locals;
  const {
    body: { receiverAccount },
    params: { accountNumber },
  } = request;
  if (!userIsAdmin && receiverAccount === accountNumber) {
    return Response.send(
      response,
      STATUS.BAD_REQUEST,
      [],
      "You can't transfer money to yourself. Enter a different receiver's account number",
      false,
    );
  }
  next();
};

export const patchTransactionDetails = (request, response, next) => {
  request.body.option = TRANSACTION.OPTION_INTERNAL;
  next();
};

export const markTransactionAsSuccessful = (request, response, next) => {
  request.body.status = TRANSACTION.STATUS_SUCCESS;
  next();
};
export const validateTransactionId = async (request, response, next) => {
  try {
    const { transactionId } = request.params;
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });

    if (!transaction || transaction.status !== TRANSACTION.STATUS_PENDING) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        [],
        'Transaction update failed because the transaction is either completed or it does not exist.',
        false,
      );
    }
    next();
  } catch (error) {
    return Response.send(
      response,
      STATUS.SERVER_ERROR,
      MESSAGE.SERVER_ERROR,
      false,
    );
  }
};

export const verifyActivationCode = async (request, response, next) => {
  try {
    const {
      params: { transactionId },
      body: { activationCode },
    } = request;

    const transaction = await Transaction.findOne({
      where: { id: transactionId, activationCode },
    });

    if (!transaction) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        [],
        'OTP is not correct',
        false,
      );
    }
    next();
  } catch (error) {
    return Response.send(
      response,
      STATUS.SERVER_ERROR,
      MESSAGE.SERVER_ERROR,
      false,
    );
  }
};

export const checkPendingTransaction = async (request, response, next) => {
  try {
    const { accountNumber } = request.params;

    const transaction = await Transaction.findOne({
      where: { accountNumber, status: 0 },
    });

    if (transaction) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        { transactionId: transaction.id },
        'You have a pending transaction. You need to complete or cancel your pending transaction  before you can proceed.',
        false,
      );
    }
    next();
  } catch (error) {
    return Response.send(
      response,
      STATUS.SERVER_ERROR,
      MESSAGE.SERVER_ERROR,
      false,
    );
  }
};

export default {};
