const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");

const PositionController = require("../Controllers/PositionController.js");

router.get("/", authMiddleware,PositionController.getPositions);

module.exports = router;