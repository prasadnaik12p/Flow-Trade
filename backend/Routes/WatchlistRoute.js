const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");



const WatchlistController = require("../Controllers/WatchlistContoller")

router.get("/", authMiddleware,WatchlistController.allWatchlists);
router.post("/add", authMiddleware, WatchlistController.addToWatchList);
router.post("/remove", authMiddleware, WatchlistController.removeFromWatchlist);


module.exports = router;

