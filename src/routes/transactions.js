import express from 'express';
import { handleValidation } from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import {
  validateAdmin,
  validateUserOrAdmin,
} from '../middleware/validateAdmin';
import {
  validateTransactionDetails,
  validateTransferRestrictions,
  patchTransactionDetails,
  validateTransactionCustomerDetails,
  validateTransactionId,
  markTransactionAsSuccessful,
  verifyActivationCode,
  validateTransactionActivationCode,
  checkPendingTransaction,
  validateTransactionType,
} from '../middleware/validateTransactions';
import { validatePin } from '../middleware/validatePin';
import { validateAccountBalance } from '../middleware/validateAccountBalance';
import { TransactionController } from '../controllers/transactionController';
import { filterQuery } from '../helpers/filters';

const router = express.Router();

// get transactions
router.get(
  '/',
  validateToken,
  filterQuery,
  TransactionController.getTransactions,
);

// create transaction
router.post(
  '/:accountNumber',
  validateToken,
  validateUserOrAdmin,
  validateTransactionCustomerDetails,
  handleValidation,
  validateTransferRestrictions,
  validatePin,
  checkPendingTransaction,
  validateAccountBalance,
  TransactionController.createTransaction,
);

// Create transaction as an admin
router.post(
  '/:accountNumber/admin',
  validateToken,
  validateAdmin,
  patchTransactionDetails,
  validateTransactionDetails,
  validateTransactionType,
  handleValidation,
  validateAccountBalance,
  TransactionController.createTransaction,
);

// Cancel transaction
router.delete(
  '/:transactionId/cancel',
  validateToken,
  validateTransactionId,
  TransactionController.deleteTransaction,
);

// Verify transaction as an admin
router.patch(
  '/:transactionId/verify',
  validateToken,
  validateTransactionId,
  validateTransactionActivationCode,
  handleValidation,
  verifyActivationCode,
  markTransactionAsSuccessful,
  TransactionController.updateTransaction,
);

export default router;
