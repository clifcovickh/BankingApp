const express = require('express');
const router = express.Router();

// Import all controllers
const customerController = require('../controllers/customerController');
const accountController = require('../controllers/accountController');
const transactionController = require('../controllers/transactionController');
const adminController = require('../controllers/adminController');
const requestController = require('../controllers/requestController');

// 1. CUSTOMER ROUTES
router.post('/customers', customerController.createCustomer); // Admin creates a customer record
router.get('/customers', customerController.getAllCustomers); // Admin view of all customers
router.put('/customers/:id', customerController.updateCustomer); // Admin edit customer data
router.delete('/customers/:id', customerController.deleteCustomer); // Admin delete customer
router.post('/register', customerController.register); // User registration, create new customer
router.post('/login', customerController.login); // User login, authenticate customer

// 1.b Admin convenience routes
router.get('/customers-with-accounts', adminController.getCustomersWithAccounts); // Admin fetch customers and their accounts

// 2. DEPOSITO TYPE ROUTES
router.post('/deposito-types', adminController.createDepositoType); // Admin creates new deposito types with specific interest rates
router.put('/deposito-types/:id', adminController.updateDepositoType); // Admin updates existing deposito types
router.delete('/deposito-types/:id', adminController.deleteDepositoType); // Admin deletes a deposito type
router.get('/deposito-types', adminController.getAllDepositoTypes); // Admin view of all deposito types

// 3. ACCOUNT ROUTES
router.post('/accounts', accountController.openAccount); // Open a new account for a customer with a specific deposito type
router.get('/accounts', accountController.getAllAccounts); // Admin view of all accounts
router.get('/accounts/:id', accountController.getAccountById); // Get a single account by id
router.get('/accounts/customer/:customerId', accountController.getAccountsByCustomer); // Get all accounts for a specific customer
router.put('/accounts/:id', accountController.updateAccount); // Admin edit account details
router.delete('/accounts/:id', accountController.deleteAccount); // Admin delete account

// 4. TRANSACTION ROUTES
router.post('/transactions', transactionController.handleTransaction); // Handle deposits and withdrawals, including interest calculation for withdrawals
router.get('/transactions/:accountId', transactionController.getTransactionHistory); // Get transaction history for a specific account

// 5. REQUEST ROUTES
router.post('/requests', requestController.createRequest); // User will use this to submit a request, either for account closure or customer profile deletion
router.get('/requests/pending', requestController.getPendingRequests); // Admin will use this to fetch all pending requests for review (both account closure and customer deletion)
router.put('/requests/:id', requestController.updateRequestStatus); // Admin will use this to approve or reject a request, which will trigger the corresponding action (close account or delete customer profile)

module.exports = router;
