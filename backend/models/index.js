const Customer = require('./Customer');

const Account = require('./Account');

const Transaction = require('./Transaction');

const DepositoType = require('./DepositoType');

const Request = require('./Request');

Customer.hasMany(Account, { foreignKey: 'customer_id' });

Account.belongsTo(Customer, { foreignKey: 'customer_id' });

DepositoType.hasMany(Account, { foreignKey: 'deposito_type' });

Account.belongsTo(DepositoType, { foreignKey: 'deposito_type' });

Account.hasMany(Transaction, { foreignKey: 'account_id' });

Transaction.belongsTo(Account, { foreignKey: 'account_id' });

// A Request belongs to a Customer

Customer.hasMany(Request, { foreignKey: 'customer_id', onDelete: 'CASCADE' });

Request.belongsTo(Customer, { foreignKey: 'customer_id' });

// A Request belongs to an Account

Account.hasMany(Request, { foreignKey: 'account_id', onDelete: 'CASCADE' });

Request.belongsTo(Account, { foreignKey: 'account_id' });

module.exports = { Customer, Account, Transaction, DepositoType, Request };
