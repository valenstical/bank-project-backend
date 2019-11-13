import { Response, valueFromToken } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { User } = models;

const sendError = (response) => {
  Response.send(
    response,
    STATUS.FORBIDDEN,
    [],
    'You do not have permission to perform that action.',
    false,
  );
};

export const validateAdmin = async (request, response, next) => {
  const accountNumber = valueFromToken('accountNumber', response);
  try {
    const user = await User.getUser('accountNumber', accountNumber);
    if (!user.isAdmin) {
      return sendError(response);
    }
    response.locals.userIsAdmin = true;
    next();
  } catch (error) {
    return Response.sendServerError(response, error);
  }
};

export const validateUserOrAdmin = async (request, response, next) => {
  const accountNumber = valueFromToken('accountNumber', response);
  const { accountNumber: accNum } = request.params;
  try {
    const user = await User.getUser('accountNumber', accountNumber);
    if (!(user.isAdmin || accountNumber === accNum)) {
      return sendError(response);
    }
    response.locals.user = user;
    next();
  } catch (error) {
    return Response.sendServerError(response, error);
  }
};

export default {};
