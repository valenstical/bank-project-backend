import Random from 'random-int';
import { Response, valueFromToken, paginate } from '../helpers/utils';
import { STATUS, MESSAGE, TRANSACTION } from '../helpers/constants';
import models from '../database/models';
import { SMS } from '../helpers/sendSMS';
import { Mailer } from '../helpers/sendMail';

const {
  Sequelize: { Op },
} = models;
export class TransactionController {
  /**
   * Get all data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getTransactions(request, response) {
    const { where, order, userIsAdmin } = response.locals;
    const { page, limit, offset } = paginate(request.query);
    const accountNumber = valueFromToken('accountNumber', response);

    try {
      if (!userIsAdmin) {
        where.accountNumber = accountNumber;
      }
      const result = await models.Transaction.findAndCountAll({
        limit,
        offset,
        where,
        order,
      });
      return Response.send(
        response,
        STATUS.OK,
        {
          result: result.rows,
          pagination: {
            currentPage: +page,
            lastPage: Math.ceil(result.count / limit),
            currentCount: result.rows.length,
            totalCount: result.count,
          },
        },
        'Transactions fetched successfully',
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

  /**
   * Add a new data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async createTransaction(request, response) {
    const {
      locals: { userIsAdmin, user },
    } = response;
    const {
      params: { accountNumber },
    } = request;
    try {
      const { body } = request;
      body.id = Random(10000000000, 99999999999);
      body.activationCode = Random(1000, 9999);
      body.type = body.type || 0;
      body.status = userIsAdmin
        ? TRANSACTION.STATUS_SUCCESS
        : TRANSACTION.STATUS_PENDING;

      const result = await models.Transaction.create({
        ...body,
        accountNumber,
      });
      const { dataValues } = result;
      delete dataValues.activationCode;

      if (!userIsAdmin) {
        const message = `Please approve with OTP: ${body.activationCode} to complete your transaction or call customer care to stop the transfer.`;
        SMS.send(message, user.phone);
        Mailer.send(
          user.email,
          `${process.env.BANK_NAME} One Time Password`,
          message,
        );
      }

      return Response.send(
        response,
        STATUS.CREATED,
        dataValues,
        'Transaction successfully created',
        true,
      );
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        [],
        MESSAGE.SERVER_ERROR,
        false,
      );
    }
  }

  /**
   * Edit the selected data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async updateTransaction(request, response) {
    const {
      body,
      params: { transactionId },
    } = request;
    try {
      await models.Transaction.update(body, {
        where: {
          id: transactionId,
          [Op.not]: { status: TRANSACTION.STATUS_SUCCESS },
        },
      });
      return Response.send(
        response,
        STATUS.OK,
        [],
        'Transaction updated sucessfully!',
        true,
      );
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        [],
        MESSAGE.SERVER_ERROR,
        false,
      );
    }
  }

  /**
   * Delete the selected data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async deleteTransaction(request, response) {
    const { transactionId } = request.params;
    try {
      await models.Transaction.destroy({
        where: { id: transactionId },
      });
      return Response.send(
        response,
        STATUS.OK,
        [],
        'Transaction canceled',
        true,
      );
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        [],
        MESSAGE.SERVER_ERROR,
        false,
      );
    }
  }
}
export default {};
