const express = require('express');

const router = express.Router();

// Import all controllers

const customerController = require('../controllers/customerController');

const accountController = require('../controllers/accountController');

const transactionController = require('../controllers/transactionController');

const adminController = require('../controllers/adminController');

const requestController = require('../controllers/requestController');

/**

 * @swagger

 * tags:

 *   - name: Auth

 *     description: User authentication and registration

 *   - name: Customers

 *     description: Customer management

 *   - name: DepositoTypes

 *     description: Deposito type management

 *   - name: Accounts

 *     description: Account management

 *   - name: Transactions

 *     description: Deposit and withdrawal operations

 *   - name: Requests

 *     description: Customer requests and admin review

 */

/**

 * @swagger

 * /register:

 *   post:

 *     summary: Register a new customer

 *     tags: [Auth]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - name

 *               - username

 *               - password

 *             properties:

 *               name:

 *                 type: string

 *               username:

 *                 type: string

 *               password:

 *                 type: string

 *     responses:

 *       201:

 *         description: Customer registered

 *       400:

 *         description: Validation error

 */

router.post('/register', customerController.register);

/**

 * @swagger

 * /login:

 *   post:

 *     summary: Customer login

 *     tags: [Auth]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - username

 *               - password

 *             properties:

 *               username:

 *                 type: string

 *               password:

 *                 type: string

 *     responses:

 *       200:

 *         description: Login successful

 *       401:

 *         description: Invalid credentials

 */

router.post('/login', customerController.login);

/**

 * @swagger

 * /customers:

 *   post:

 *     summary: Create a new customer

 *     tags: [Customers]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               name:

 *                 type: string

 *               username:

 *                 type: string

 *               password:

 *                 type: string

 *     responses:

 *       201:

 *         description: Customer created

 *   get:

 *     summary: Get all customers

 *     tags: [Customers]

 *     responses:

 *       200:

 *         description: List of customers

 */

router.post('/customers', customerController.createCustomer);

router.get('/customers', customerController.getAllCustomers);

/**

 * @swagger

 * /customers/{id}:

 *   put:

 *     summary: Update a customer

 *     tags: [Customers]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Customer ID

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               name:

 *                 type: string

 *               username:

 *                 type: string

 *               password:

 *                 type: string

 *     responses:

 *       200:

 *         description: Customer updated

 *   delete:

 *     summary: Delete a customer

 *     tags: [Customers]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Customer ID

 *     responses:

 *       200:

 *         description: Customer deleted

 */

router.put('/customers/:id', customerController.updateCustomer);

router.delete('/customers/:id', customerController.deleteCustomer);

/**

 * @swagger

 * /customers-with-accounts:

 *   get:

 *     summary: Get customers with their accounts

 *     tags: [Customers]

 *     responses:

 *       200:

 *         description: Customers with accounts

 */

router.get('/customers-with-accounts', adminController.getCustomersWithAccounts);

/**

 * @swagger

 * /deposito-types:

 *   get:

 *     summary: Get all deposito types

 *     tags: [DepositoTypes]

 *     responses:

 *       200:

 *         description: List of deposito types

 *   post:

 *     summary: Create a deposito type

 *     tags: [DepositoTypes]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - type

 *               - yearly_return

 *             properties:

 *               type:

 *                 type: string

 *               yearly_return:

 *                 type: number

 *     responses:

 *       201:

 *         description: Deposito type created

 */

router.post('/deposito-types', adminController.createDepositoType);

router.get('/deposito-types', adminController.getAllDepositoTypes);

/**

 * @swagger

 * /deposito-types/{id}:

 *   put:

 *     summary: Update a deposito type

 *     tags: [DepositoTypes]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Deposito type ID

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               type:

 *                 type: string

 *               yearly_return:

 *                 type: number

 *     responses:

 *       200:

 *         description: Deposito type updated

 *   delete:

 *     summary: Delete a deposito type

 *     tags: [DepositoTypes]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Deposito type ID

 *     responses:

 *       200:

 *         description: Deposito type deleted

 */

router.put('/deposito-types/:id', adminController.updateDepositoType);

router.delete('/deposito-types/:id', adminController.deleteDepositoType);

/**

 * @swagger

 * /accounts:

 *   get:

 *     summary: Get all accounts

 *     tags: [Accounts]

 *     responses:

 *       200:

 *         description: List of accounts

 *   post:

 *     summary: Open a new account

 *     tags: [Accounts]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - customer_id

 *               - deposito_type

 *               - balance

 *             properties:

 *               customer_id:

 *                 type: integer

 *               deposito_type:

 *                 type: integer

 *               balance:

 *                 type: number

 *     responses:

 *       201:

 *         description: Account opened

 */

router.post('/accounts', accountController.openAccount);

router.get('/accounts', accountController.getAllAccounts);

/**

 * @swagger

 * /accounts/{id}:

 *   get:

 *     summary: Get account by ID

 *     tags: [Accounts]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Account ID

 *     responses:

 *       200:

 *         description: Account details

 *   put:

 *     summary: Update an account

 *     tags: [Accounts]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Account ID

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               customer_id:

 *                 type: integer

 *               deposito_type:

 *                 type: integer

 *               balance:

 *                 type: number

 *     responses:

 *       200:

 *         description: Account updated

 *   delete:

 *     summary: Delete an account

 *     tags: [Accounts]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Account ID

 *     responses:

 *       200:

 *         description: Account deleted

 */

router.get('/accounts/:id', accountController.getAccountById);

router.put('/accounts/:id', accountController.updateAccount);

router.delete('/accounts/:id', accountController.deleteAccount);

/**

 * @swagger

 * /accounts/customer/{customerId}:

 *   get:

 *     summary: Get accounts for a customer

 *     tags: [Accounts]

 *     parameters:

 *       - in: path

 *         name: customerId

 *         schema:

 *           type: integer

 *         required: true

 *         description: Customer ID

 *     responses:

 *       200:

 *         description: List of customer accounts

 */

router.get('/accounts/customer/:customerId', accountController.getAccountsByCustomer);

/**

 * @swagger

 * /transactions:

 *   post:

 *     summary: Create a transaction for an account

 *     tags: [Transactions]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - account_id

 *               - action_type

 *               - amount

 *             properties:

 *               account_id:

 *                 type: integer

 *               action_type:

 *                 type: string

 *                 enum: [DEPOSIT, WITHDRAW]

 *               amount:

 *                 type: number

 *               transaction_date:

 *                 type: string

 *                 format: date

 *     responses:

 *       201:

 *         description: Transaction processed

 */

router.post('/transactions', transactionController.handleTransaction);

/**

 * @swagger

 * /transactions/{accountId}:

 *   get:

 *     summary: Get transaction history for an account

 *     tags: [Transactions]

 *     parameters:

 *       - in: path

 *         name: accountId

 *         schema:

 *           type: integer

 *         required: true

 *         description: Account ID

 *     responses:

 *       200:

 *         description: List of transactions

 */

router.get('/transactions/:accountId', transactionController.getTransactionHistory);

/**

 * @swagger

 * /requests:

 *   post:

 *     summary: Submit a customer request

 *     tags: [Requests]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required:

 *               - customer_id

 *               - request_type

 *             properties:

 *               customer_id:

 *                 type: integer

 *               account_id:

 *                 type: integer

 *               request_type:

 *                 type: string

 *               reason:

 *                 type: string

 *     responses:

 *       201:

 *         description: Request submitted

 */

router.post('/requests', requestController.createRequest);

/**

 * @swagger

 * /requests/pending:

 *   get:

 *     summary: Get pending customer requests

 *     tags: [Requests]

 *     responses:

 *       200:

 *         description: List of pending requests

 */

router.get('/requests/pending', requestController.getPendingRequests);

/**

 * @swagger

 * /requests/{id}:

 *   put:

 *     summary: Update request status

 *     tags: [Requests]

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: integer

 *         required: true

 *         description: Request ID

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               status:

 *                 type: string

 *             required:

 *               - status

 *     responses:

 *       200:

 *         description: Request status updated

 */

router.put('/requests/:id', requestController.updateRequestStatus);

module.exports = router;
