import express from 'express';
import { handleValidation } from '../middleware/validatorHelpers';
import UserController from '../controllers/userController';
import {
  validateAdminLogin,
  validateCustomerLogin,
} from '../middleware/validateLogin';
import {
  validateRegisterUser,
  validateUpdateUser,
  validateDeactiveUser,
  validateProfileImage,
  validatePassword,
  validateAccountType,
  validatePin,
} from '../middleware/validateRegistration';
import { validateToken } from '../middleware/authenticate';
import {
  validateAdmin,
  validateUserOrAdmin,
} from '../middleware/validateAdmin';
import {
  validateAccountNumber,
  validateBankId,
} from '../middleware/validateTransactions';

const router = express.Router();

// Login user
router.post(
  '/login',
  validateCustomerLogin,
  handleValidation,
  UserController.login,
);

// Login Admin
router.post(
  '/admin/login',
  validateAdminLogin,
  handleValidation,
  UserController.login,
);

// Add a new user
router.post(
  '/',
  validateRegisterUser,
  handleValidation,
  UserController.registerUser,
);

// Edit an existing user profile details
router.patch(
  '/profile/:accountNumber',
  validateToken,
  validateUserOrAdmin,
  validateUpdateUser,
  handleValidation,
  UserController.updateUser,
);

// Edit an existing user profile image
router.patch(
  '/image/:accountNumber',
  validateToken,
  validateUserOrAdmin,
  validateProfileImage,
  handleValidation,
  UserController.updateUser,
);

// Edit an existing user password
router.patch(
  '/password/:accountNumber',
  validateToken,
  validatePassword,
  handleValidation,
  UserController.updateUser,
);

// Edit an existing user account type
router.patch(
  '/account/:accountNumber',
  validateToken,
  validateAdmin,
  validateAccountType,
  handleValidation,
  UserController.updateUser,
);

// Edit an existing user pin
router.patch(
  '/pin/:accountNumber',
  validateToken,
  validatePin,
  handleValidation,
  UserController.updateUser,
);

// Deactivate an existing user
router.patch(
  '/status/:accountNumber',
  validateToken,
  validateAdmin,
  validateDeactiveUser,
  handleValidation,
  UserController.deactivateUser,
);

// Deactivate an existing user
router.get(
  '/generate',
  validateToken,
  validateBankId,
  validateAccountNumber,
  handleValidation,
  UserController.getOrCreateUser,
);

export default router;
