const { StockSchema } = require('../schemas/StockSchema');
const {model} = require('mongoose');

const StockModel = new model('Stock', StockSchema);

module.exports = { StockModel };