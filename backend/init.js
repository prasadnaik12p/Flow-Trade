require('dotenv').config();  

const API_KEY = process.env.API_KEY;
const axios = require('axios');
const { StockModel } = require('../models/StockModel.js');


module.exports.initializeStocks = async (req,res) => {
    try {
        const result = await axios.get(
            `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`
        );
        const stocksToInsert = result.data.slice(0, 20).map(stock => ({
            symbol: stock.symbol,
            exchange: stock.exchange,
            name: stock.name,
            type: stock.type
        }));

        await StockModel.deleteMany({});
        await StockModel.insertMany(stocksToInsert);
        console.log("Stocks initialized successfully.");
        res.send("Ok Data initilizeed")
    
    } catch (error) {
        console.log("Error in initializing stocks:", error);
    }
}
    
        



