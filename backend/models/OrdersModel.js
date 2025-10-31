const { model } = require('mongoose');
const { OrdersSchema } = require('../schemas/OrdersSchema');

const Order = new model("Order", OrdersSchema);

module.exports = { Order }; 