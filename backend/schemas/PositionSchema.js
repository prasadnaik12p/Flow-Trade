const { Schema } = require("mongoose");

const PositionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   stockId: { type: Schema.Types.ObjectId, ref: 'UserStock', required: true },
    quantity: { type: Number, default: 1, required: true },
    price: { type: Number, default: 0,required: true },
    totalPrice: { type: Number, default: 0, required: true },
    date: { type: Date, default: Date.now },
    symbol: { type: String },
    BSstatus: { type: String, }, // BUY or SELl
    profitLoss: { type: Number, default: 0 },
    avgPrice: { type: Number, default: 0 },
});


module.exports = { PositionSchema };