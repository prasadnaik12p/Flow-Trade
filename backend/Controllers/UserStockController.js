const { UserStockModel } = require("../models/UserStockModel");
const { Position } = require("../models/PositionModel");
const { Order } = require("../models/OrdersModel");
const { User } = require("../models/UserModel");
const { Transaction } = require("../models/TransactionModel");

module.exports.allStocks = async (req, res) => {
  try {
    const allStocks = await UserStockModel.find({});
    res.json(allStocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stocks", details: err.message });
  }
};

module.exports.buyStock = async (req, res) => {
  try {
    // Accept both 'qty' and 'quantity'
    const { 
      symbol, 
      name, 
      qty, 
      quantity, // Accept both field names
      price, 
      totalPrice, 
      limitPrice, 
      mode 
    } = req.body;

  
    const finalQty = qty || quantity;
    
    if (!finalQty) {
      return res.status(400).json({ 
        error: "Quantity is required",
        details: "Please provide either 'qty' or 'quantity' field" 
      });
    }

    const currentUser = req.currentUser;
    let newOrder;

    const user = await User.findById(currentUser.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate required amount
    const requiredAmount = mode === "MARKET" ? totalPrice : finalQty * limitPrice;

    if (user.virtualBalance < requiredAmount) {
      return res.status(400).json({ 
        success: false,
        error: "INSUFFICIENT_BALANCE",
        message: "Insufficient balance to buy stocks",
        currentBalance: user.virtualBalance,
        requiredAmount: requiredAmount,
        shortfall: requiredAmount - user.virtualBalance
      });
    }

    // Continue with your existing logic...
    if (mode === "MARKET") {
      // Deduct balance
      await User.findByIdAndUpdate(currentUser.id, {
        $inc: { virtualBalance: -totalPrice }
      });

      // Record transaction
      await Transaction.create({
        userId: currentUser.id,
        type: 'trade_buy',
        amount: -totalPrice,
        currency: 'inr',
        assetSymbol: symbol,
        assetName: name,
        quantity: finalQty, 
        price: price,
        totalValue: totalPrice,
        balanceBefore: user.virtualBalance,
        balanceAfter: user.virtualBalance - totalPrice,
        description: `Bought ${finalQty} shares of ${symbol}`
      });

      // Create order with finalQty
      newOrder = new Order({
        userId: currentUser.id,
        symbol,
        name,
        qty: finalQty, 
        price,
        totalPrice,
        mode,
        BSstatus: "BUY",
        status: "Accepted"
      });
      await newOrder.save();

      // Check if user already owns this stock
      let existingStock = await UserStockModel.findOne({
        userId: currentUser.id,
        symbol,
        status: "Accepted",
      });

      let existingPosition;

      if (existingStock) {
        // Update existing holding
        const newQuantity = existingStock.quantity + qty;
        const newTotalCost = existingStock.avgPrice * existingStock.quantity + totalPrice;
        const newAvgPrice = newTotalCost / newQuantity;

        existingStock.quantity = newQuantity;
        existingStock.avgPrice = newAvgPrice;
        existingStock.price = price;
        existingStock.totalPrice = newTotalCost;

        await existingStock.save();

        // Find and update existing BUY position
        existingPosition = await Position.findOne({
          stockId: existingStock._id,
          userId: currentUser.id,
          BSstatus: "BUY",
          status: "open"
        });

        if (existingPosition) {
          existingPosition.quantity = newQuantity;
          existingPosition.totalPrice = newTotalCost;
          existingPosition.avgPrice = newAvgPrice;
          await existingPosition.save();
          console.log("Updated existing BUY position quantity to:", newQuantity);
        }
      } else {
        // First-time MARKET buy
        existingStock = new UserStockModel({
          userId: currentUser.id,
          symbol,
          name,
          type: mode,
          quantity: qty,
          price,
          avgPrice: price,
          totalPrice,
          status: "Accepted",
          BSstatus: "BUY"
        });
        await existingStock.save();
      }

      // Create new Position only if it doesn't exist
      if (!existingPosition) {
        const newPosition = new Position({
          stockId: existingStock._id,
          userId: currentUser.id,
          symbol,
          name,
          BSstatus: "BUY",
          quantity: qty,
          price,
          totalPrice,
          date: new Date(),
          avgPrice: price,
          status: 'open'
        });
        await newPosition.save();
        console.log(" Created new BUY position with quantity:", qty);
      }

      return res.json({ message: "Stock Purchased Successfully", data: existingStock });
    } 

    // 🔹 LIMIT ORDER
    else if (mode === "LIMIT") {
      newOrder = new Order({
        userId: currentUser.id,
        symbol,
        name,
        qty,
        price,
        totalPrice: qty * limitPrice,
        mode,
        BSstatus: "BUY",
        limitPrice,
        status: "Pending"
      });
      await newOrder.save();

      return res.json({ 
        message: "Limit Buy Order Placed - Will execute when price drops to your limit", 
        data: newOrder,
        note: "Order is PENDING and will be executed automatically when market price reaches your limit price"
      });
    }
  } catch (err) {
    console.error("Buy stock error:", err);
    res.status(500).json({ error: "Failed to buy stock", details: err.message });
  }
};

module.exports.sellStock = async (req, res) => {
  try {
    const { stockId, qty, price, mode } = req.body;
    const currentUser = req.currentUser;

    console.log("SELL STARTED - User:", currentUser.id);
    console.log("Sell request:", { stockId, qty, price, mode });

    //  Find the UserStock
    let userStock = await UserStockModel.findOne({
      _id: stockId,
      userId: currentUser.id,
    });

    if (!userStock) {
      console.log(" UserStock not found");
      return res.status(400).json({ error: "Stock not found" });
    }

    console.log(" Found UserStock:", {
      symbol: userStock.symbol,
      quantity: userStock.quantity,
      avgPrice: userStock.avgPrice
    });

    // Check quantity
    if (qty > userStock.quantity) {
      console.log("Insufficient quantity");
      return res.status(400).json({ error: "Insufficient quantity" });
    }

    const totalSaleValue = qty * price;
    const profitLoss = (price - userStock.avgPrice) * qty;

    const user = await User.findById(currentUser.id);
    const balanceBefore = user.virtualBalance;


    await User.findByIdAndUpdate(currentUser.id, {
      $inc: { virtualBalance: totalSaleValue }
    });


         await Transaction.create({
      userId: currentUser.id,
      type: 'trade_sell',
      amount: totalSaleValue,
      currency: 'inr',
      assetSymbol: userStock.symbol,
      assetName: userStock.name,
      quantity: qty,
      price: price,
      totalValue: totalSaleValue,
      balanceBefore: balanceBefore,
      balanceAfter: balanceBefore + totalSaleValue,
      description: `Sold ${qty} shares of ${userStock.symbol}`,
      metadata: { profitLoss: profitLoss }
    });






    //  Create SELL Order
    const newOrder = new Order({
      userId: currentUser.id,
      symbol: userStock.symbol,
      name: userStock.name,
      qty,
      price,
      totalPrice: qty * price,
      mode,
      BSstatus: "SELL",
      status: "Accepted",
    });
    await newOrder.save();
    console.log("✅ Sell order created");

    // Calculate profit/loss
    // const profitLoss = (price - userStock.avgPrice) * qty;
    console.log("💰 Profit/Loss:", profitLoss);

    //  CRITICAL - Update UserStock quantity
    const newQuantity = userStock.quantity - qty;
    console.log("🔄 Updating UserStock quantity:", userStock.quantity, "->", newQuantity);
    
    userStock.quantity = newQuantity;
    
    if (newQuantity === 0) {
      console.log("🗑️ Deleting UserStock (quantity reached 0)");
      await UserStockModel.deleteOne({ _id: userStock._id });
    } else {
      userStock.totalPrice = newQuantity * userStock.avgPrice;
      await userStock.save();
      console.log("✅ UserStock updated");
    }

    // CRITICAL - Update ALL Position quantities
    console.log("🔄 Finding positions to update...");
    const positions = await Position.find({
      stockId: userStock._id,
      userId: currentUser.id,
      BSstatus: "BUY"
    });

    console.log(`📊 Found ${positions.length} positions to update`);
    
    let remainingQtyToUpdate = qty;
    
    for (let position of positions) {
      if (remainingQtyToUpdate <= 0) break;
      
      console.log("🔄 Updating position:", {
        positionId: position._id,
        currentQty: position.quantity,
        toReduce: remainingQtyToUpdate
      });
      
      if (position.quantity <= remainingQtyToUpdate) {
        // This position will be completely sold
        remainingQtyToUpdate -= position.quantity;
        position.quantity = 0;
        position.status = 'closed';
        console.log("🔒 Closed position");
      } else {
        // Partial sell from this position
        position.quantity -= remainingQtyToUpdate;
        remainingQtyToUpdate = 0;
        console.log("📉 Reduced position quantity to:", position.quantity);
      }
      
      position.totalPrice = position.quantity * position.avgPrice;
      await position.save();
      console.log("✅ Position saved");
    }

    console.log("🎉 SELL COMPLETED SUCCESSFULLY");
    console.log("📊 Final state:", {
      sold: qty,
      userStockQuantity: newQuantity,
      positionsUpdated: positions.length
    });

    return res.json({ 
      success: true,
      message: "Stock Sold Successfully", 
      data: newOrder,
      profitLoss: profitLoss,
      soldQuantity: qty,
      remainingQuantity: newQuantity
    });

  } catch (err) {
    console.error("💥 SELL ERROR:", err);
    res.status(500).json({ error: "Failed to sell stock", details: err.message });
  }
};

// 🔹 Get user positions - FIXED VERSION
module.exports.getUserPositions = async (req, res) => {
  try {
    console.log("📡 getUserPositions called");
    console.log("🔍 req.currentUser:", req.currentUser);
    
    // FIX: Check if currentUser exists and has id
    if (!req.currentUser || !req.currentUser.id) {
      console.log("❌ No currentUser or currentUser.id found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const currentUser = req.currentUser;
    const userId = currentUser.id;
    
    console.log("📡 Getting positions for user:", userId);
    
    // Get ONLY open BUY positions with quantity > 0
    const positions = await Position.find({ 
      userId: userId,
      BSstatus: "BUY",
      quantity: { $gt: 0 } // Only positions with quantity > 0
    })
    .populate('stockId')
    .sort({ date: -1 });

    console.log(`✅ Found ${positions.length} active positions`);
    
    // Log each position for debugging
    positions.forEach(pos => {
      console.log(`📊 ${pos.symbol}: ${pos.quantity} shares`);
    });

    res.json({
      success: true,
      data: positions,
      count: positions.length
    });

  } catch (err) {
    console.error("❌ Get positions error:", err);
    res.status(500).json({ error: "Failed to fetch positions", details: err.message });
  }
};

// 🔹 FORCE REFRESH POSITIONS ENDPOINT 
module.exports.forceRefreshPositions = async (req, res) => {
  try {
    console.log("🔄 forceRefreshPositions called");
    console.log("🔍 req.currentUser:", req.currentUser);
    
    // FIX: Check if currentUser exists and has id
    if (!req.currentUser || !req.currentUser.id) {
      console.log("❌ No currentUser or currentUser.id found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const currentUser = req.currentUser;
    const userId = currentUser.id;
    
    console.log("🔄 FORCE REFRESH - User:", userId);
    
    // Get ONLY open BUY positions with quantity > 0
    const positions = await Position.find({ 
      userId: userId,
      BSstatus: "BUY",
      quantity: { $gt: 0 }
    })
    .populate('stockId')
    .sort({ date: -1 });

    console.log(`🔄 Force refresh found ${positions.length} positions`);
    
    positions.forEach(pos => {
      console.log(`🔄 ${pos.symbol}: ${pos.quantity} shares`);
    });

    res.json({
      success: true,
      data: positions,
      count: positions.length,
      refreshedAt: new Date(),
      message: "Positions force refreshed successfully"
    });

  } catch (err) {
    console.error("Force refresh error:", err);
    res.status(500).json({ error: "Failed to refresh positions", details: err.message });
  }
};



// 🔹 Get pending orders for a user 
module.exports.getPendingOrders = async (req, res) => {
  try {
    console.log("🔍 getPendingOrders called");
    console.log("🔍 req.currentUser:", req.currentUser);
    
    // FIX: Check if currentUser exists and has id
    if (!req.currentUser || !req.currentUser.id) {
      console.log("❌ No currentUser or currentUser.id found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const currentUser = req.currentUser;
    const userId = currentUser.id;
    
    const pendingOrders = await Order.find({
      userId: userId,
      status: "Pending"
    });
    
    res.json(pendingOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending orders", details: err.message });
  }
};

// 🔹 Cancel a pending order
module.exports.cancelOrder = async (req, res) => {
  try {
    console.log("🔍 cancelOrder called");
    console.log("🔍 req.currentUser:", req.currentUser);
    
    // FIX: Check if currentUser exists and has id
    if (!req.currentUser || !req.currentUser.id) {
      console.log("❌ No currentUser or currentUser.id found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const currentUser = req.currentUser;
    const userId = currentUser.id;
    
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      status: "Pending"
    });

    if (!order) {
      return res.status(404).json({ error: "Pending order not found" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", data: order });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel order", details: err.message });
  }
};