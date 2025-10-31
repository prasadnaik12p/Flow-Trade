const express = require('express');
const router = express.Router();
const priceController = require('../Controllers/PriceController');
const authMiddleware = require("../middleware/authMiddleware");


router.use(authMiddleware);


router.get('/stock-price/:symbol', priceController.getStockPrice);


router.post('/stock-prices', priceController.getMultipleStockPrices);


router.get('/exchange-rate', priceController.getExchangeRate);

module.exports = router;