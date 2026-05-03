const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const bcrypt = require('bcryptjs');

const Customer = sequelize.define(
  'Customer',
  {
    id: { type: DataTypes.STRING, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },

    username: {
      type: DataTypes.STRING,

      allowNull: false,

      unique: true, // Prevents two people from having the same username
    },

    password: {
      type: DataTypes.STRING,

      allowNull: false,
    },
  },
  {
    hooks: {
      // 1. Generate the CST_xx ID

      beforeCreate: async (customer) => {
        const last = await Customer.findOne({ order: [['id', 'DESC']] });

        let nextNum = 1;

        if (last && last.id) {
          nextNum = parseInt(last.id.split('_')[1]) + 1;
        }

        customer.id = `CST_${nextNum.toString().padStart(2, '0')}`;

        // 2. Hash the password before saving to DB

        const salt = await bcrypt.genSalt(10);

        customer.password = await bcrypt.hash(customer.password, salt);
      },
    },
  }
);

module.exports = Customer;
