import bcrypt from 'bcryptjs';
import { throws } from 'assert';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    accountNumber: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    dob: {
      type: DataTypes.INTEGER,
    },
    stateId: {
      type: DataTypes.STRING,
    },
    identificationType: {
      type: DataTypes.INTEGER,
    },
    identificationNumber: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    accountType: {
      type: DataTypes.INTEGER,
    },
    pin: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue(
          'password',
          bcrypt.hashSync(value, process.env.SECRET_KEY),
        );
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      onUpdate: sequelize.NOW,
    },
  });

  /**
   * Get a User if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The user details if found, null
   */
  User.getUser = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await User.findOne({
        where: {
          [column]: value,
        },
        attributes: {
          exclude: ['password'],
        },
      });
      result = dataValues;
    } catch (error) {
      throws(error);
    }
    return result;
  };

  return User;
};
