const { Schema } = require('mongoose');

const StockSchema = new Schema({
    symbol: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },                 
    exchange: { type: String },                              
    type: { type: String,default:"Common" },                                
    updatedAt: { type: Date, default: Date.now },            
});

module.exports = { StockSchema };