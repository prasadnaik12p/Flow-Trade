const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");

const OrderController = require("../Controllers/OrderController.js");

router.get("/", authMiddleware,OrderController.allOrders);

module.exports = router;