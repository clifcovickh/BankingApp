const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const DepositoType = sequelize.define(
  'DepositoType',
  {
    id: { type: DataTypes.STRING, primaryKey: true },

    type: { type: DataTypes.STRING, allowNull: false },

    yearly_return: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    timestamps: false,

    hooks: {
      beforeCreate: async (dtype) => {
        const last = await DepositoType.findOne({ order: [['id', 'DESC']] });

        let nextNum = 1;

        if (last && last.id) {
          nextNum = parseInt(last.id.split('_')[1]) + 1;
        }

        dtype.id = `DPT_${nextNum.toString().padStart(2, '0')}`;
      },
    },
  }
);

module.exports = DepositoType;
