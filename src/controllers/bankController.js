import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

export class BankController {
  /**
   * Get all banks
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getBanks(request, response) {
    try {
      const banks = await models.Bank.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      return Response.send(
        response,
        STATUS.OK,
        banks,
        'Bank list fetched successfully',
        true,
      );
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        [],
        'Server error, please try again.',
        false,
      );
    }
  }
}
export default {};
