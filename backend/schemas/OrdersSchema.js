const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  mode: { type: String, required: true },
  BSstatus: { type: String, required: true },
  status: { type: String, required: true },
  executedPrice: { type: String },
  limitPrice: { type: Number },

  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "reserved"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["virtual_balance", "stripe_deposit"],
    default: "virtual_balance",
  },
  executedPrice: Number,
  executedAt: Date,
  profitLoss: Number,
});

module.exports = { OrdersSchema };
