import { Response, valueFromToken } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { User } = models;


export const validatePin = async (request, response, next) => {
  const accountNumber = valueFromToken('accountNumber', response);
  const { pin } = request.body;
  try {
    const user = await User.getUser('accountNumber', accountNumber);
    if (user.pin !== pin) {
      return Response.send(
        response,
        STATUS.BAD_REQUEST,
        [],
        'Your PIN is incorrect',
        false,
      );
    }
    next();
  } catch (error) {
    return Response.sendServerError(response, error);
  }
};


export default {};
