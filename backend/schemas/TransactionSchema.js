const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const TransactionSchema = new Schema({
userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'trade_buy', 'trade_sell', 'dividend', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'  
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // For deposits 
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // For trades
  assetSymbol: String,
  assetName: String,
  quantity: Number,
  price: Number,
  totalValue: Number,
  
  // Balance tracking
  balanceBefore: Number,
  balanceAfter: Number,
  
  description: String,
  metadata: mongoose.Schema.Types.Mixed
  
},
);


module.exports = { TransactionSchema};