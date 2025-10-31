const { WatchlistModel } = require('../models/WatchlistModel');
const { StockModel } = require("../models/StockModel");

module.exports.allWatchlists = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const allWatchlists = await WatchlistModel.find({ userId: currentUser.id }).populate('stockId');
    res.json(allWatchlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.addToWatchList = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const { symbol } = req.body;
    // console.log(currentUser);
    // console.log(currentUser.id);

    // Find stock in your Stock collection
    const stock = await StockModel.findOne({ symbol });
    if (!stock) return res.status(404).json({ error: "Stock not found" });

    //  Check if already in watchlist
    const existing = await WatchlistModel.findOne({
      userId: currentUser.id,
      stockId: stock._id
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: `${symbol} is already in your watchlist` });
    }

    //  If not, add new
    const newWatchlist = new WatchlistModel({
      userId: currentUser.id,
      stockId: stock._id,
    });

    await newWatchlist.save();
    res.json({ message: `${symbol} added to your watchlist` });

  } catch (err) {
    console.error("Error adding to watchlist:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.removeFromWatchlist = async (req, res) =>{
  try {
    const currentUser = req.currentUser;
    const { symbol } = req.body;

    // ✅ Find stock in your Stock collection
    const stock = await StockModel.findOne({ symbol });
    if (!stock) return res.status(404).json({ error: "Stock not found" });

    // ✅ Find and remove from watchlist
    const result = await WatchlistModel.deleteOne({
      userId: currentUser.id,
      stockId: stock._id
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `${symbol} was not in your watchlist` });
    }

    res.json({ message: `${symbol} removed from your watchlist` });
  } catch (err) {
    console.error("Error removing from watchlist:", err.message);
  }
}