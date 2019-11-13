import { throws } from 'assert';

export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    transactionDate: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    receiverBank: {
      type: DataTypes.STRING,
    },
    receiverName: {
      type: DataTypes.STRING,
    },
    receiverAccount: {
      type: DataTypes.STRING,
    },
    receiverEmail: {
      type: DataTypes.STRING,
    },
    receiverPhone: {
      type: DataTypes.STRING,
    },
    ifscCode: {
      type: DataTypes.STRING,
    },
    option: {
      type: DataTypes.INTEGER,
    },
    activationCode: {
      type: DataTypes.INTEGER,
    },
    accountNumber: {
      type: DataTypes.STRING,
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

  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'accountNumber',
      targetKey: 'accountNumber',
      onDelete: 'RESTRICT',
    });
  };
  Transaction.getTotal = async (accountNumber, type, status) => {
    try {
      const result = await Transaction.findOne({
        where: { accountNumber, type, status },
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      });
      return result.dataValues.total || 0;
    } catch (error) {
      throws(error);
    }
  };
  return Transaction;
};
