const { Transaction, Account, DepositoType } = require('../models/index');

const { transactionSchema } = require('../middleware/validators');

/**

 * Handles Deposits and Withdrawals

 * Includes Interest Calculation for Withdrawals based on the selected deposito type's yearly return

 */

exports.handleTransaction = async (req, res) => {
  try {
    const { account_id, type, action_type, amount, transaction_date } = req.body;

    const transactionType = action_type || type;

    const data = transactionSchema.parse({
      action_type: transactionType,

      amount,

      transaction_date,
    });

    const account = await Account.findByPk(account_id, {
      include: [{ model: DepositoType }],
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const effectiveDate = data.transaction_date ? new Date(data.transaction_date) : new Date();

    let finalAmount = amount;

    let interestEarned = 0;

    if (transactionType === 'WITHDRAW') {
      if (account.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      const startDate = new Date(account.createdAt);

      const endDate = effectiveDate;

      let monthDiff =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      if (endDate.getDate() < startDate.getDate()) {
        monthDiff--;
      }

      const totalMonths = Math.max(0, monthDiff);

      const yearlyReturn = parseFloat(account.DepositoType?.yearly_return) || 0;

      const monthlyReturn = yearlyReturn / 12 / 100;

      interestEarned = account.balance * monthlyReturn * totalMonths;

      finalAmount = amount + interestEarned;

      account.balance -= amount;
    } else if (transactionType === 'DEPOSIT') {
      account.balance += amount;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    await account.save();

    const transaction = await Transaction.create({
      account_id,

      action_type: transactionType,

      amount: transactionType === 'WITHDRAW' ? finalAmount : amount,

      transaction_date: effectiveDate,
    });

    res.status(201).json({
      message: `${transactionType} successful`,

      data: {
        transaction_id: transaction.id,

        type: transaction.action_type,

        principal: amount,

        interest_paid: interestEarned,

        total_processed: transaction.amount,

        new_balance: account.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Transaction failed',

      error: error.message,
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { accountId } = req.params;

    const transactions = await Transaction.findAll({
      where: { account_id: accountId },

      order: [['transaction_date', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
