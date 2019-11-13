import { validationResult, body, param } from 'express-validator/check';
import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';

export const validateRequired = (
  field,
  message = `${field} is required`,
  message2 = message,
  minlength = 0,
  maxlength = Number.MAX_SAFE_INTEGER,
) => body(field)
    .trim()
    .not()
    .isEmpty()
    .withMessage(message)
    .isLength({ min: minlength, max: maxlength })
    .withMessage(message2);

export const validateOptional = (field, message = `Enter a ${field}`) => body(field)
    .trim()
    .optional()
    .not()
    .isEmpty()
    .withMessage(message);

export const validateDigits = (field, message = `Enter a valid ${field}`) => body(field)
    .trim()
    .isNumeric()
    .withMessage(message);

export const validateDigitsFromParams = (
  field,
  message = `Enter a valid ${field}`,
) => param(field)
    .trim()
    .isNumeric()
    .withMessage(message);

export const validateOptionalUrl = (
  field,
  message = `Enter a valid ${field}`,
) => body(field)
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage(message);

export const validateOptionalBoolean = (
  field,
  message = `Enter a valid ${field}`,
) => body(field)
    .optional()
    .isBoolean()
    .withMessage(message);

export const validateBoolean = (field, message = `Enter a valid ${field}`) => body(field)
    .isBoolean()
    .withMessage(message);

export const validateEmpty = (field, message = `${field} is required`) => body(field)
    .not()
    .isEmpty()
    .withMessage(message);

export const validateNumber = (
  field,
  message = `${field} must be a 7 digit number`,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
) => body(field)
    .trim()
    .isInt()
    .withMessage(message)
    .isInt({ min, max })
    .withMessage(message)
    .toInt(10);
export const validateFloat = (field, message = `${field} must be a number`) => body(field)
    .trim()
    .isFloat()
    .withMessage(message)
    .toFloat();

export const validateOptionalNumber = (
  field,
  message = `${field} must be a 7 digit number`,
  min = 1000000,
  max = 9999999,
) => body(field)
    .trim()
    .optional()
    .isInt()
    .withMessage(message)
    .isInt({ min, max })
    .withMessage(message)
    .toInt(10);

export const validateUrl = (field = 'url', message = 'Enter a valid url') => body(field)
    .trim()
    .isURL()
    .withMessage(message);

export const validateEmail = (
  field = 'email',
  message = 'Enter a valid email address',
) => body(field)
    .trim()
    .isEmail()
    .withMessage(message);

export const validateComparison = (
  field1,
  field2,
  message = 'Passwords do not match.',
) => [
  body(field1)
    .not()
    .isEmpty()
    .withMessage(`${field1} is required`),
  body(field2)
    .not()
    .isEmpty()
    .withMessage(`${field2} is required`)
    .custom((password, { req }) => {
      if (password !== req.body[field1]) {
        throw new Error(message);
      } else {
        return password;
      }
    }),
];

export const handleValidation = (request, response, next) => {
  const errors = validationResult(request).formatWith(({ param, msg }) => ({
    [param]: msg,
  }));
  if (!errors.isEmpty()) {
    return Response.send(
      response,
      STATUS.BAD_REQUEST,
      errors.array({ onlyFirstError: true }),
      MESSAGE.VALIDATE_ERROR,
      false,
    );
  }
  next();
};
