const { model } = require('mongoose');
const { PaymentSchema } = require('../schemas/PaymentSchema');

const Payment = new model('Payment', PaymentSchema);

module.exports = { Payment };





