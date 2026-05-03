const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Transaction = sequelize.define(
  'Transaction',
  {
    id: { type: DataTypes.STRING, primaryKey: true },

    action_type: { type: DataTypes.STRING, allowNull: false },

    amount: { type: DataTypes.FLOAT, allowNull: false },

    transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,

    hooks: {
      beforeCreate: async (tx) => {
        const last = await Transaction.findOne({ order: [['id', 'DESC']] });

        let nextNum = 1;

        if (last && last.id) {
          nextNum = parseInt(last.id.split('_')[1]) + 1;
        }

        tx.id = `TSX_${nextNum.toString().padStart(2, '0')}`;
      },
    },
  }
);

module.exports = Transaction;
