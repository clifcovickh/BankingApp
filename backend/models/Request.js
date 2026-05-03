const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Request = sequelize.define(
  'Request',
  {
    id: { type: DataTypes.STRING, primaryKey: true },

    customer_id: {
      type: DataTypes.STRING,

      allowNull: false,

      references: {
        model: 'Customers',

        key: 'id',
      },
    },

    account_id: {
      type: DataTypes.STRING,

      allowNull: true,

      references: {
        model: 'Accounts',

        key: 'id',
      },
    },

    request_type: {
      type: DataTypes.ENUM('CLOSE_ACCOUNT', 'DELETE_PROFILE'),

      allowNull: false,
    },

    reason: { type: DataTypes.TEXT },

    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),

      defaultValue: 'PENDING',
    },
  },
  {
    hooks: {
      beforeCreate: async (req) => {
        const last = await Request.findOne({ order: [['id', 'DESC']] });

        let nextNum = 1;

        if (last && last.id) {
          nextNum = parseInt(last.id.split('_')[1]) + 1;
        }

        req.id = `REQ_${nextNum.toString().padStart(2, '0')}`;
      },
    },
  }
);

module.exports = Request;
