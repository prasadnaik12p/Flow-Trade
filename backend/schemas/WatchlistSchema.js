const { Schema } = require('mongoose');

const WatchlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stockId: { type: Schema.Types.ObjectId, ref: 'Stock', required: true },
    date: { type: Date, default:Date.now}
   
});


module.exports = { WatchlistSchema };