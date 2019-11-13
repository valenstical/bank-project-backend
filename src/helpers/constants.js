export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNATHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSED: 422,
  SERVER_ERROR: 500,
};

export const TRANSACTION = {
  STATUS: ['Pending', 'Success', 'Canceled'],
  OPTION: ['Internal Transfer', 'Inter-bank Transfer'],
  TYPE: ['Debit', 'Credit'],

  STATUS_PENDING: 0,
  STATUS_SUCCESS: 1,
  STATUS_CANCELED: 2,

  TYPE_DEBIT: 0,
  TYPE_CREDIT: 1,

  OPTION_INTERNAL: 0,
  OPTION_INTERBANK: 1,
};

export const ACCOUNT_PREFIX = '00';
export const GENDER = ['Male', 'Female'];
export const ACCOUNT_TYPE = ['Savings', 'Current', 'Fixed Deposit'];

export const MESSAGE = {
  SERVER_ERROR:
    'An internal error has occured. This is not your fault. We are working to fix this problem. Please try again later.',

  NOT_FOUND: 'Resource not found',
  UNATHORIZED_ACCESS: 'You do not have permission to access that resource',
  INVALID_CREDENTIALS: 'Invalid user credentials',

  CREATE_SUCCESS: 'Successfully created',
  UPDATE_SUCCESS: 'Successfully updated',
  VALIDATE_ERROR:
    'There was a problem with your request, please check the values you entered.',

  SUCCESS_MESSAGE: 'Operation was successful',
  FAILURE_MESSAGE: 'Operation failed',
};

export const CITIES = [
  'Abuja',
  'Warri',
  'Enugu',
  'Kaduna',
  'Ikeja',
  'Ekpoma',
  'Auchi',
  'Bariga',
];

export default {};
