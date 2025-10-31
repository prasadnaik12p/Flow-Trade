const { UserStockModel } = require("../models/UserStockModel");
const { Order } = require("../models/OrdersModel");
const { Position } = require("../models/PositionModel");
const { getCachedUsdToInrRate, getCurrentStockPrice, getUnifiedStockPrice } = require("../Controllers/PriceController");

// 🔹 Execute pending limit orders (BUY and SELL)
async function executePendingOrders() {
  try {
    const pendingOrders = await Order.find({ 
      status: "Pending", 
      mode: "LIMIT" 
    });
    
    if (pendingOrders.length === 0) {
      console.log("No pending orders to check");
      return;
    }

    console.log(`Checking ${pendingOrders.length} pending orders...`);

    const symbols = [...new Set(pendingOrders.map(order => order.symbol))];
    const pricesMap = {};

    console.log(`Fetching current INR prices for symbols: ${symbols.join(', ')}`);

    // Get current INR prices for all symbols
    for (let symbol of symbols) {
      try {
        const priceData = await getUnifiedStockPrice(symbol);
        if (priceData && priceData.priceINR) {
          pricesMap[symbol] = priceData.priceINR;
          console.log(` ${symbol}: $${priceData.priceUSD.toFixed(2)} USD → ₹${priceData.priceINR.toFixed(2)} INR`);
        } else {
          console.log(`Failed to fetch price for ${symbol}`);
          pricesMap[symbol] = null;
        }
      } catch (error) {
        console.error(`Error fetching ${symbol} price:`, error.message);
        pricesMap[symbol] = null;
      }
      
      // Rate limiting between API calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    let executedCount = 0;

    for (let order of pendingOrders) {
      const currentPriceINR = pricesMap[order.symbol];
      
      
      if (!currentPriceINR) {
        console.log(` Skipping ${order.symbol}: Could not fetch current price`);
        continue;
      }

      let shouldExecute = false;
      let reason = "";

      // Check if order conditions are met (all prices in INR)
      if (order.BSstatus === "BUY" && currentPriceINR <= order.limitPrice) {
        shouldExecute = true;
        reason = `BUY: Current (₹${currentPriceINR.toFixed(2)}) <= Limit (₹${order.limitPrice.toFixed(2)})`;
      }
      else if (order.BSstatus === "SELL" && currentPriceINR >= order.limitPrice) {
        shouldExecute = true;
        reason = `SELL: Current (₹${currentPriceINR.toFixed(2)}) >= Limit (₹${order.limitPrice.toFixed(2)})`;
      }

      if (shouldExecute) {
        console.log(` Executing order: ${order.symbol} - ${reason}`);
        
        try {
          // Update order status
          order.status = "Accepted";
          order.executedPrice = currentPriceINR; // Store in INR
          order.executedAt = new Date();
          await order.save();

          // Execute the order
          await executeOrder(order, currentPriceINR);
          executedCount++;
          
          console.log(`Successfully executed ${order.BSstatus} order for ${order.symbol} at ₹${currentPriceINR.toFixed(2)}`);
        } catch (executionError) {
          console.error(`Failed to execute order ${order._id}:`, executionError.message);
          // Revert order status on failure
          order.status = "Pending";
          await order.save();
        }
      } else {
        console.log(` Order ${order._id} still pending: ${order.symbol} - Current: ₹${currentPriceINR.toFixed(2)}, Limit: ₹${order.limitPrice.toFixed(2)}`);
      }
    }

    console.log(` Order execution completed: ${executedCount} orders executed`);

  } catch (err) {
    console.error(" Error executing pending orders:", err.message);
  }
}

// 🔹 Execute a single order (all prices in INR)
async function executeOrder(order, currentPriceINR) {
  const totalCostINR = currentPriceINR * order.qty;

  if (order.BSstatus === "BUY") {
    await executeBuyOrder(order, currentPriceINR, totalCostINR);
  } else if (order.BSstatus === "SELL") {
    await executeSellOrder(order, currentPriceINR, totalCostINR);
  }
}

// 🔹 Execute BUY order
async function executeBuyOrder(order, currentPriceINR, totalCostINR) {
  let existingStock = await UserStockModel.findOne({
    userId: order.userId,
    symbol: order.symbol,
    status: "Accepted",
  });

  if (existingStock) {
    // Update existing stock position
    const newQuantity = existingStock.quantity + order.qty;
    const newTotalCostINR = existingStock.avgPrice * existingStock.quantity + totalCostINR;
    const newAvgPriceINR = newTotalCostINR / newQuantity;

    existingStock.quantity = newQuantity;
    existingStock.avgPrice = newAvgPriceINR;
    existingStock.price = currentPriceINR;
    existingStock.totalPrice = newTotalCostINR;
    await existingStock.save();
    
    console.log(` Updated ${order.symbol} position: ${existingStock.quantity} shares at avg ₹${newAvgPriceINR.toFixed(2)}`);
  } else {
    // Create new stock position
    existingStock = new UserStockModel({
      userId: order.userId,
      symbol: order.symbol,
      name: order.name,
      type: "LIMIT",
      quantity: order.qty,
      price: currentPriceINR,
      avgPrice: currentPriceINR,
      totalPrice: totalCostINR,
      status: "Accepted",
      BSstatus: "BUY"
    });
    await existingStock.save();
    
    console.log(` Created new ${order.symbol} position: ${order.qty} shares at ₹${currentPriceINR.toFixed(2)}`);
  }

  // Record the transaction
  const newPosition = new Position({
    stockId: existingStock._id,
    userId: order.userId,
    symbol: order.symbol,
    BSstatus: "BUY",
    quantity: order.qty,
    price: currentPriceINR,
    totalPrice: totalCostINR,
    date: new Date(),
  });
  await newPosition.save();
}

// 🔹 Execute SELL order
async function executeSellOrder(order, currentPriceINR, totalCostINR) {
  // Find all available stock positions for this symbol
  const availableStocks = await UserStockModel.find({
    userId: order.userId,
    symbol: order.symbol,
    status: "Accepted",
    BSstatus: "BUY",
  });

  if (!availableStocks || availableStocks.length === 0) {
    throw new Error(`No stock positions found for user: ${order.symbol}`);
  }

  // Calculate total available quantity
  const totalAvailableQuantity = availableStocks.reduce((total, stock) => total + stock.quantity, 0);
  
  if (totalAvailableQuantity < order.qty) {
    throw new Error(`Insufficient quantity: Has ${totalAvailableQuantity}, Trying to sell ${order.qty}`);
  }

  let remainingQtyToSell = order.qty;
  const soldPositions = [];

  // Sell from available positions (FIFO - First In First Out)
  for (let stock of availableStocks) {
    if (remainingQtyToSell <= 0) break;

    const qtyToSellFromThisPosition = Math.min(stock.quantity, remainingQtyToSell);
    
    // Calculate profit/loss for this partial sale
    const buyPrice = stock.avgPrice;
    const sellPrice = currentPriceINR;
    const profitLoss = (sellPrice - buyPrice) * qtyToSellFromThisPosition;

    // Update stock position
    stock.quantity -= qtyToSellFromThisPosition;
    stock.totalPrice = stock.quantity * stock.avgPrice;

    if (stock.quantity === 0) {
      // Remove position if all shares are sold
      await UserStockModel.deleteOne({ _id: stock._id });
      console.log(`  Removed ${order.symbol} position (sold all shares)`);
    } else {
      await stock.save();
      console.log(` Updated ${order.symbol} position: ${stock.quantity} shares remaining`);
    }

    // Record the sell transaction
    const newPosition = new Position({
      stockId: stock._id,
      userId: order.userId,
      symbol: order.symbol,
      BSstatus: "SELL",
      quantity: qtyToSellFromThisPosition,
      price: currentPriceINR,
      totalPrice: qtyToSellFromThisPosition * currentPriceINR,
      profitLoss: profitLoss,
      date: new Date(),
    });
    await newPosition.save();
    soldPositions.push(newPosition);

    remainingQtyToSell -= qtyToSellFromThisPosition;
    
    console.log(` Sold ${qtyToSellFromThisPosition} shares of ${order.symbol} at ₹${currentPriceINR.toFixed(2)} | P/L: ₹${profitLoss.toFixed(2)}`);
  }

  // Update the original order with execution details
  order.executedPrice = currentPriceINR;
  order.executedAt = new Date();
  
  // Calculate total profit/loss for the entire order
  const totalProfitLoss = soldPositions.reduce((total, pos) => total + (pos.profitLoss || 0), 0);
  order.profitLoss = totalProfitLoss;
  
  await order.save();

  console.log(` SELL order completed: Sold ${order.qty} shares of ${order.symbol} at ₹${currentPriceINR.toFixed(2)} | Total P/L: ₹${totalProfitLoss.toFixed(2)}`);
}

// 🔹 Check if user has sufficient stocks for pending sell orders
async function validatePendingSellOrders(userId) {
  try {
    const pendingSellOrders = await Order.find({
      userId: userId,
      BSstatus: "SELL",
      status: "Pending",
      mode: "LIMIT"
    });

    if (pendingSellOrders.length === 0) return;

    console.log(` Validating ${pendingSellOrders.length} pending SELL orders for user ${userId}...`);

    for (let order of pendingSellOrders) {
      const availableStocks = await UserStockModel.find({
        userId: userId,
        symbol: order.symbol,
        status: "Accepted",
        BSstatus: "BUY",
      });

      const totalAvailableQuantity = availableStocks.reduce((total, stock) => total + stock.quantity, 0);
      
      if (totalAvailableQuantity < order.qty) {
        console.log(`  Cancelling SELL order: Insufficient shares for ${order.symbol}. Available: ${totalAvailableQuantity}, Order: ${order.qty}`);
        
        // Cancel the order
        order.status = "Cancelled";
        order.cancellationReason = `Insufficient shares. Available: ${totalAvailableQuantity}, Order: ${order.qty}`;
        await order.save();
        
        console.log(` Cancelled SELL order for ${order.symbol}`);
      }
    }
  } catch (error) {
    console.error("Error validating pending sell orders:", error.message);
  }
}

// 🔹 Update portfolio prices and P/L using unified pricing (all in INR)
async function updatePortfolioPrices() {
  try {
    const allStocks = await UserStockModel.find({ status: "Accepted" });
    if (!allStocks.length) {
      console.log(" No stocks in portfolio to update");
      return;
    }

    console.log(` Updating INR prices for ${allStocks.length} portfolio stocks...`);
    
    const symbols = [...new Set(allStocks.map(s => s.symbol))];
    const pricesMap = {};

    // Get current INR prices for all portfolio symbols
    for (let symbol of symbols) {
      try {
        const priceData = await getUnifiedStockPrice(symbol);
        if (priceData && priceData.priceINR) {
          pricesMap[symbol] = priceData.priceINR;
          console.log(` ${symbol}: ₹${priceData.priceINR.toFixed(2)}`);
        } else {
          console.log(` Failed to fetch price for ${symbol}`);
        }
      } catch (error) {
        console.error(` Error fetching ${symbol} price:`, error.message);
      }
      
      // Rate limiting between API calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    let updatedCount = 0;

    // Update each stock with current INR price and calculate P/L
    for (let stock of allStocks) {
      const currentPriceINR = pricesMap[stock.symbol];
      if (!currentPriceINR) continue;

      // Calculate profit/loss in INR
      const profitOrLossINR = (currentPriceINR - stock.avgPrice) * stock.quantity;
      const currentStatus = profitOrLossINR >= 0 ? "Profit" : "Loss";

      // Update stock with current INR price
      stock.price = currentPriceINR;
      stock.profitOrLoss = profitOrLossINR;
      stock.currentStatus = currentStatus;
      await stock.save();
      
      updatedCount++;
      
      console.log(` ${stock.symbol}: ${stock.quantity} shares | Avg: ₹${stock.avgPrice.toFixed(2)} | Current: ₹${currentPriceINR.toFixed(2)} | P/L: ₹${profitOrLossINR.toFixed(2)} (${currentStatus})`);
    }

    console.log(` Portfolio update completed: ${updatedCount} stocks updated with current INR prices`);

  } catch (err) {
    console.error(" Error updating portfolio prices:", err.message);
  }
}

// 🔹 Validate all pending sell orders for all users
async function validateAllPendingSellOrders() {
  try {
    const usersWithPendingSells = await Order.distinct('userId', {
      BSstatus: "SELL",
      status: "Pending",
      mode: "LIMIT"
    });

    console.log(` Validating pending SELL orders for ${usersWithPendingSells.length} users...`);

    for (let userId of usersWithPendingSells) {
      await validatePendingSellOrders(userId);
    }

    console.log(" Pending SELL orders validation completed");
  } catch (error) {
    console.error(" Error validating all pending sell orders:", error.message);
  }
}

// 🔹 Main polling function
async function checkStocks() {
  try {
    console.log(" Starting stock check cycle...");
    
    // First validate pending sell orders
    await validateAllPendingSellOrders();
    
    // Then execute pending orders
    await executePendingOrders();
    
    // Finally update portfolio prices
    await updatePortfolioPrices();
    
    console.log(" Stock check cycle completed");
  } catch (err) {
    console.error(" Error in stock polling:", err.message);
  }
}

// 🔹 Start poller every 1 minute
function startPoller() {
  console.log(" Stock poller started (checking every 60 seconds)...");
  checkStocks();
  setInterval(checkStocks, 60 * 1000);
}

module.exports = { 
  startPoller, 
  checkStocks, 
  executePendingOrders,
  validatePendingSellOrders,
  executeSellOrder 
};