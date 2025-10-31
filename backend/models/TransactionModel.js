const { model } = require('mongoose');
const {TransactionSchema } = require('../schemas/TransactionSchema');

const Transaction = new model("Transaction", TransactionSchema);

module.exports = {  Transaction };