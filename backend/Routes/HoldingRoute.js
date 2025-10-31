const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware.js");

const HoldingContrller = require("../Controllers/HoldingController.js");


router.get("/",authMiddleware,HoldingContrller.getHoldings);


module.exports = router;