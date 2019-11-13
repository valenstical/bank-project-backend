import {
  validateRequired,
  validateEmail,
  validateEmpty,
  validateNumber,
  validateUrl,
  validateBoolean,
} from './validatorHelpers';

export const validateUpdateUser = [
  validateRequired('firstname'),
  validateRequired('lastname'),
  validateRequired('stateId', 'State is required'),
  validateRequired('phone'),
  validateNumber('gender', 'Gender is required', 0, 1),
  validateRequired('address'),
  validateRequired('city'),
  validateRequired('zip', 'Zip code is required'),
  validateRequired('dob', 'Date of birth is required'),
  validateNumber('identificationType', 'Identification type is required'),
  validateRequired('identificationNumber', 'Identification number is required'),
  validateRequired('email'),
  validateEmail(),
];

export const validateProfileImage = [
  validateUrl('image', 'Image upload link must be a valid URL'),
];

export const validatePassword = [validateEmpty('password')];

export const validateAccountType = [
  validateNumber('accountType', 'Account Type is required', 0, 2),
];

export const validatePin = [validateRequired('pin')];

export const validateRegisterUser = [
  ...validateUpdateUser,
  ...validateAccountType,
  ...validatePin,
  ...validatePassword,
];

export const validateDeactiveUser = [
  validateBoolean('isActive', 'The current user account status is required'),
];

export default {};
