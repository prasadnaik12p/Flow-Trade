const { Schema } = require('mongoose');
const mongoose = require('mongoose');


const PaymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripePaymentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'  // Changed to INR for your use case
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    default: 'pending'
  },
  paymentMethod: String,
  stripeCustomerId: String,
  clientSecret: String,
  
  // Error handling
  errorMessage: String,
  errorCode: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
  
  
});


module.exports = { PaymentSchema };