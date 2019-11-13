import jwt from 'jsonwebtoken';
import { STATUS, MESSAGE } from '../helpers/constants';
import { Response } from '../helpers/utils';

const displayError = (response) => {
  Response.send(response, STATUS.UNATHORIZED, null, MESSAGE.UNATHORIZED_ACCESS, false);
};

const processToken = (authorization, response, next) => {
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (error, value) => {
    if (error || !value) return displayError(response);
    response.locals.authValue = value;
    next();
  });
};

export const validateToken = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) return displayError(response);
  processToken(authorization, response, next);
};

export default {};
