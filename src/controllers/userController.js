import bcrypt from 'bcryptjs';
import Random from 'random-int';
import faker from 'ng-faker';
import DateGenerator from 'random-date-generator';

import { Response, generateToken } from '../helpers/utils';
import {
 STATUS, ACCOUNT_PREFIX, MESSAGE, CITIES 
} from '../helpers/constants';
import models from '../database/models';
import { SMS } from '../helpers/sendSMS';
import { Mailer } from '../helpers/sendMail';

const {
  User,
  Sequelize: { Op },
} = models;

class UserController {
  /**
   * Login a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async login(request, response) {
    const { password } = request.body;
    const encryptedPassword = bcrypt.hashSync(password, process.env.SECRET_KEY);
    try {
      let result = await User.findOne({
        where: {
          ...request.body,
          password: encryptedPassword,
        },
        attributes: {
          exclude: ['password', 'pin'],
        },
      });
      const status = result !== null;
      let code = STATUS.UNATHORIZED;
      let message = 'Your log in credentials are invalid.';

      if (status) {
        result = result.dataValues;
        result.token = generateToken({ accountNumber: result.accountNumber });
        code = STATUS.OK;
        message = 'Log in  successful!';

        if (!result.isActive) {
          return Response.send(
            response,
            STATUS.UNATHORIZED,
            [],
            'Your account is currently inactive. Please contact our customer care to activate your account.',
            false,
          );
        }
      }

      return Response.send(response, code, result, message, status);
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        error,
        'Log in failed, please try again.',
        false,
      );
    }
  }

  static sendMessage(body, message, subject) {
    SMS.send(message, body.phone);
    Mailer.send(body.email, subject, message);
  }

  /**
   * Register  a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async registerUser(request, response) {
    const { body } = request;
    try {
      body.accountNumber = `${ACCOUNT_PREFIX}${Random(10000000, 99999999)}`;
      await User.create(body);
      return Response.send(
        response,
        STATUS.CREATED,
        [],
        `Thank you for opening an account with ${process.env.BANK_NAME}. You will receive an email and SMS with your account number soon.`,
        true,
      );
    } catch (error) {
      return UserController.displayInsertError(
        'Registration failed.',
        error,
        response,
      );
    }
  }

  /**
   * Register  a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static generateUser(accountNumber, bankId) {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    return {
      firstname,
      lastname,
      email: `${firstname}.${lastname}@email.com`.toLowerCase(),
      password: '123',
      stateId: Random(0, 36),
      phone: faker.phone.phoneNumber(),
      gender: Random(0, 1),
      accountNumber,
      bankId,
      address: 'No. 2 airport road',
      city: CITIES[Random(0, CITIES.length - 1)],
      dob: DateGenerator.getRandomDateInRange(new Date(1940, 1, 1), new Date()),
    };
  }

  /**
   * Update a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async updateUser(request, response) {
    const { accountNumber } = request.params;
    try {
      await User.update(request.body, { where: { accountNumber } });
      return Response.send(
        response,
        STATUS.OK,
        null,
        'Update sucessful!',
        true,
      );
    } catch (error) {
      return UserController.displayInsertError(
        'Update user details failed.',
        error,
        response,
      );
    }
  }

  /**
   * Get or create a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getOrCreateUser(request, response) {
    const { bankId, accountNumber } = request.body;
    let user = null;
    try {
      const result = await User.findOne({ where: { accountNumber } });
      if (result) {
        user = UserController.cleanUserDetails(result.dataValues);
        if (bankId !== result.bankId) {
          return Response.send(
            response,
            STATUS.FORBIDDEN,
            [],
            'Account not found. Did you choose the correct bank?',
            false,
          );
        }
      } else {
        user = UserController.generateUser(accountNumber, bankId);
        await models.User.create(user);
      }
      return Response.send(response, STATUS.OK, user, 'User found', true);
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        MESSAGE.SERVER_ERROR,
        false,
      );
    }
  }

  /**
   * Delete/Deactive a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async deactivateUser(request, response) {
    const {
      body: { isActive },
      params: { accountNumber },
    } = request;
    try {
      await User.update(
        { isActive },
        { where: { accountNumber, [Op.not]: { isAdmin: true } } },
      );

      if (isActive) {
        const { dataValues } = await models.User.findOne({
          where: { accountNumber },
        });
        const message = `Hello ${dataValues.firstname}, \nYour account number ${accountNumber} is now active.\n Thank you for choosing ${process.env.BANK_NAME}`;
        const subject = `Welcome to ${process.env.BANK_NAME}`;
        UserController.sendMessage(dataValues, message, subject);
      }

      return Response.send(
        response,
        STATUS.OK,
        null,
        'Customer status updated!',
        true,
      );
    } catch (error) {
      return UserController.displayInsertError(
        'Update user status failed.',
        error,
        response,
      );
    }
  }

  /**
   * Helper method to send insert or update error
   * @static
   * @param {string} title The title of the error message
   * @param {object} error The error object
   * @param {object} response The response object
   * @memberof MemberController
   */
  static displayInsertError(title, error, response) {
    const { errors } = error;
    const { path } = errors[0];
    const message =      path === 'email' ? 'Email already exists' : 'Phone number already exists';
    Response.send(
      response,
      STATUS.UNPROCESSED,
      [
        {
          [path]: message,
        },
      ],
      `${title}`,
      false,
    );
  }

  static cleanUserDetails(user) {
    delete user.pin;
    delete user.password;
    return user;
  }
}
export default UserController;
