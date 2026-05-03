const { Account, Customer, DepositoType } = require('../models/index');

const { accountSchema } = require('../middleware/validators');

exports.openAccount = async (req, res) => {
  try {
    // 1. Zod Validation (Requirement 3: Logic Guardrails)

    const data = accountSchema.parse(req.body);

    // 2. Relational Integrity Check: Does the customer exist?

    const customer = await Customer.findByPk(data.customer_id);

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // 3. Does the Deposito Type exist?

    const type = await DepositoType.findByPk(data.deposito_type);

    if (!type) return res.status(404).json({ message: 'Invalid Deposito Type' });

    // 4. Create Account

    const newAccount = await Account.create({
      id: data.id,

      customer_id: data.customer_id,

      deposito_type: data.deposito_type,

      balance: data.balance,
    });

    res.status(201).json(newAccount);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors);

    res.status(500).json({ message: error.message });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id, {
      include: [{ model: DepositoType }],
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account', error: error.message });
  }
};

exports.getAccountsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const accounts = await Account.findAll({
      where: { customer_id: customerId },

      include: [{ model: DepositoType }],
    });

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found for this customer' });
    }

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error: error.message });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      include: [{ model: Customer }, { model: DepositoType }],
    });

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const { customer_id, deposito_type, balance } = req.body;

    const account = await Account.findByPk(id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (customer_id) {
      const customer = await Customer.findByPk(customer_id);

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      account.customer_id = customer_id;
    }

    if (deposito_type) {
      const type = await DepositoType.findByPk(deposito_type);

      if (!type) {
        return res.status(404).json({ message: 'Deposito type not found' });
      }

      account.deposito_type = deposito_type;
    }

    if (typeof balance !== 'undefined') {
      if (balance < 0) {
        return res.status(400).json({ message: 'Balance cannot be negative' });
      }

      account.balance = balance;
    }

    await account.save();

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update account', error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the account to check the balance

    const account = await Account.findByPk(id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // 2. The "Balance Zero" Rule

    if (account.balance !== 0) {
      return res.status(400).json({
        message:
          'Action Denied: Account balance must be 0 before closing. Current balance: ' +
          account.balance,
      });
    }

    // 3. Execution (Admin-only logic would be handled by Middleware later)

    await Account.destroy({ where: { id } });

    res.status(200).json({ message: `Account ${id} has been successfully closed by Admin.` });
  } catch (error) {
    res.status(500).json({ message: 'Error during account closure', error: error.message });
  }
};
