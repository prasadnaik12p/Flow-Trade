const express = require('express');
const router = express.Router();
const getStocks = require('../Controllers/StocksController.js');
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware,getStocks.allStocks);

module.exports = router;