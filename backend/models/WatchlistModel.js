const { model } = require('mongoose');
const { WatchlistSchema } = require('../schemas/WatchlistSchema');

const WatchlistModel = new model("Watchlist", WatchlistSchema);

module.exports = { WatchlistModel };