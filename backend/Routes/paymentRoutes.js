const express = require('express');
const router = express.Router();
const paymentController = require("../Controllers/PaymentController");
const authMiddleware = require("../middleware/authMiddleware");



router.get('/balance', authMiddleware ,paymentController.getBalance);


router.get('/history', authMiddleware, paymentController.getPaymentHistory);




router.post('/quick-add',  authMiddleware, paymentController.quickAddFunds);

module.exports = router;