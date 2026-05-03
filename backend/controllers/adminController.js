const { DepositoType, Customer, Account } = require('../models/index');

exports.createDepositoType = async (req, res) => {
  try {
    const newType = await DepositoType.create(req.body);

    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create deposito type. Check if the ID already exists.',

      error: error.message,
    });
  }
};

exports.updateDepositoType = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await DepositoType.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'Deposito type not found or no changes made' });
    }

    res.status(200).json({ message: 'Deposito type updated successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating deposito type',

      error: error.message,
    });
  }
};

exports.getAllDepositoTypes = async (req, res) => {
  try {
    const types = await DepositoType.findAll({
      order: [['yearly_return', 'ASC']], // List from lowest to highest return
    });

    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deposito types', error: error.message });
  }
};

exports.deleteDepositoType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await DepositoType.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Deposito type not found' });
    }

    res.status(200).json({ message: 'Deposito type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting deposito type', error: error.message });
  }
};

exports.getCustomersWithAccounts = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: Account, include: [{ model: DepositoType }] }],
    });

    res.status(200).json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching customers with accounts', error: error.message });
  }
};
