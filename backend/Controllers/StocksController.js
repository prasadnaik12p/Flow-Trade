const { StockModel } = require('../models/StockModel.js');
const { OrdersModel } = require('../models/OrdersModel.js');



module.exports.allStocks = async (req, res) => {
    let allStocks = await StockModel.find({});
    // console.log(allStocks);
    res.json(allStocks);
};





