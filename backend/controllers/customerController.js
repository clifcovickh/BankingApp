const { Customer, Account } = require('../models/index');

const bcrypt = require('bcryptjs');

const { customerSchema } = require('../middleware/validators');

exports.createCustomer = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username and password are all required.' });
    }

    const validatedData = customerSchema.parse({ name, username, password });

    const newCustomer = await Customer.create(validatedData);

    res.status(201).json({
      message: 'Customer created successfully',

      data: { id: newCustomer.id, name: newCustomer.name, username: newCustomer.username },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(400).json({ message: error.message });
  }
};

// Get all customers (Admin feature)

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve customers',

      error: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, username, password } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (name) customer.name = name;

    if (username) customer.username = username;

    if (password) {
      const salt = await bcrypt.genSalt(10);

      customer.password = await bcrypt.hash(password, salt);
    }

    await customer.save();

    res.status(200).json({
      message: 'Customer updated successfully',

      data: { id: customer.id, name: customer.name, username: customer.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer', error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the customer has any accounts remaining

    const accountCount = await Account.count({ where: { customer_id: id } });

    if (accountCount > 0) {
      return res.status(400).json({
        message: `Cannot delete customer. They still have ${accountCount} active account(s). Please close accounts first.`,
      });
    }

    // 2. If no accounts exist, proceed with deletion

    await Customer.destroy({ where: { id } });

    res.status(200).json({ message: 'Customer profile removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer profile', error: error.message });
  }
};

// REGISTER

exports.register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const user = await Customer.create({ name, username, password });

    res.status(201).json({ message: 'User registered!', customer_id: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists or invalid data' });
  }
};

// LOGIN

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Customer.findOne({ where: { username } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare hashed password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',

      user: { id: user.id, name: user.name, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
