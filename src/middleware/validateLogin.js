import {
  validateRequired, validateEmail, validateEmpty,
} from './validatorHelpers';

export const validateCustomerLogin = [
  validateRequired('accountNumber', 'Account number is required', 'Account number must be a 10 digit number', 10, 10),
  validateEmpty('password'),
];

export const validateAdminLogin = [
  validateRequired('email'),
  validateEmail(),
  validateEmpty('password'),
];

export default {};
