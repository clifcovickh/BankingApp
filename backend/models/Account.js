const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Account = sequelize.define(
  'Account',
  {
    id: { type: DataTypes.STRING, primaryKey: true },

    balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  },
  {
    hooks: {
      beforeCreate: async (account) => {
        const last = await Account.findOne({ order: [['id', 'DESC']] });

        let nextNum = 1;

        if (last && last.id) {
          nextNum = parseInt(last.id.split('_')[1]) + 1;
        }

        account.id = `ACC_${nextNum.toString().padStart(2, '0')}`;
      },
    },
  }
);

module.exports = Account;
