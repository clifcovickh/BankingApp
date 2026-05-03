const { z } = require('zod');

// Schema for Creating a Customer

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),

  username: z.string().min(3, 'Username must be at least 3 characters'),

  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for Opening an Account

const accountSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),

  deposito_type: z.string().min(1, 'Please select a Deposito Type (Bronze/Silver/Gold)'),

  balance: z.number().nonnegative('Initial balance cannot be negative'), // Requirement 3
});

// Schema for Transactions (Deposit/Withdraw)

const transactionSchema = z.object({
  action_type: z.enum(['DEPOSIT', 'WITHDRAW']),

  amount: z.number().positive('Amount must be greater than zero'), // Requirement 3

  transaction_date: z

    .string()

    .optional()

    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
});

module.exports = { customerSchema, accountSchema, transactionSchema };
