


const { Schema, model } = require("mongoose");

const UserStockSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "Common" },
  quantity: { type: Number, default: 0 },
  avgPrice: { type: Number, default: 0 },
  price: { type: Number, default: 0, required: true }, 
  totalPrice: { type: Number, default: 0, required: true },
  limitprice: { type: Number, default: 0 }, 
  status: { type: String, default: "Pending" }, 
  profitOrLoss: { type: String }, // track P&L
  currentStatus: { type: String, default: "Neutral" }, 
  BSstatus: { type: String },
  createdAt:{type:Date, default:Date.now}
});



module.exports = { UserStockSchema };
