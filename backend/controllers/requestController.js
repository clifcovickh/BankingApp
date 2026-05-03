const { Request, Account, Customer } = require('../models/index');

// User creates a request

exports.createRequest = async (req, res) => {
  try {
    const { customer_id, account_id, request_type, reason } = req.body;

    // Safety check for closure requests

    if (request_type === 'CLOSE_ACCOUNT') {
      const account = await Account.findByPk(account_id);

      if (account && account.balance > 0) {
        return res
          .status(400)
          .json({ message: 'Note: Admin will reject closure if balance is > 0' });
      }
    }

    const newRequest = await Request.create({ customer_id, account_id, request_type, reason });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

// Admin views all pending requests

exports.getPendingRequests = async (req, res) => {
  try {
    const list = await Request.findAll({ where: { status: 'PENDING' } });

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const pendingRequest = await Request.findByPk(id);

    if (!pendingRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' });
    }

    if (status === 'APPROVED') {
      if (pendingRequest.request_type === 'CLOSE_ACCOUNT') {
        const account = await Account.findByPk(pendingRequest.account_id);

        if (!account) {
          return res.status(404).json({ message: 'Account not found for this request' });
        }

        if (account.balance !== 0) {
          return res
            .status(400)
            .json({ message: 'Cannot approve account closure until account balance is 0' });
        }

        await account.destroy();
      }

      if (pendingRequest.request_type === 'DELETE_PROFILE') {
        const customer = await Customer.findByPk(pendingRequest.customer_id);

        if (!customer) {
          return res.status(404).json({ message: 'Customer not found for this request' });
        }

        const outstandingAccounts = await Account.count({ where: { customer_id: customer.id } });

        if (outstandingAccounts > 0) {
          return res.status(400).json({
            message: 'Cannot approve profile deletion while customer has active accounts',
          });
        }

        await customer.destroy();
      }
    }

    await pendingRequest.update({ status });

    res.json({ message: `Request ${id} marked as ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
