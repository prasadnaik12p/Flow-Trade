const mongoose = require("mongoose");
const { UserStockSchema } = require("../schemas/UserStockSchema");

const UserStockModel = mongoose.model("UserStock", UserStockSchema);

module.exports = { UserStockModel };
