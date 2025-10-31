const express = require("express");
const router = express.Router({ mergeParams: true });

const OverviewController = require("../Controllers/OverviewController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, OverviewController.getAccountOverview);
router.get("/dashboard-stats", authMiddleware, OverviewController.getDashboardStats);

module.exports = router;