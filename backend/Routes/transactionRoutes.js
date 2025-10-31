const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/TransactionController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware,transactionController.getUserTransactions);


router.get('/:transactionId',authMiddleware,transactionController.getTransactionById);


router.get('/stats/summary',authMiddleware, transactionController.getTransactionStats);


router.get('/export/csv', authMiddleware, transactionController.exportTransactions);

module.exports = router;