const { model } = require('mongoose');
const { PaymentSchema } = require("../schemas/paymentSchema");

const Payment = new model('Payment', PaymentSchema);

module.exports = { Payment };





