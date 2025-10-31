const { Schema } = require('mongoose');

const HoldingSchema = new Schema({
    stockId: { type: Schema.Types.ObjectId, ref: 'UserStock', required: true },
    quantity: { type: Number, default: 1, required: true },
    price: { type: Number, default: 0,required: true },
    totalPrice: { type: Number, default: 0, required: true },
    date:{type: Date, default: Date.now}
}); 

module.exports = { HoldingSchema };