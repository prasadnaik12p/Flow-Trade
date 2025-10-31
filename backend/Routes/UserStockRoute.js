const express = require('express');
const router = express.Router();
const UserStocks = require("../Controllers/UserStockController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/", authMiddleware,UserStocks.allStocks);
router.post("/buy", authMiddleware, UserStocks.buyStock);
router.post("/sell", authMiddleware, UserStocks.sellStock);



router.get('/pending-orders',authMiddleware, UserStocks.getPendingOrders);
router.post('/cancel-order', UserStocks.cancelOrder);


router.get('/Positions/', authMiddleware,UserStocks.getUserPositions); 
router.get('/force-refresh-positions', authMiddleware,UserStocks.forceRefreshPositions); 



module.exports = router;