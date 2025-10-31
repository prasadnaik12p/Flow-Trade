const { UserStockModel } = require("../models/UserStockModel");

module.exports.getHoldings = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: "User not authenticated" 
      });
    }

    const now = new Date();

    // Calculate today's date at 12:00 AM (midnight)
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0); // Set to 12:00 AM today

    // console.log(`Fetching holdings for user ${userId} created before: ${todayMidnight}`);

    // Fetch holdings created before today 12:00 AM
    // REMOVED .populate('stockId') since there's no stockId reference
    const holdings = await UserStockModel.find({
      userId: userId,
      status: "Accepted",
      BSstatus: "BUY",
      createdAt: { $lt: todayMidnight }
    })
    .sort({ createdAt: -1 });

    // console.log(`Found ${holdings.length} holdings for user ${userId} created before today midnight`);

    
    const formattedHoldings = holdings.map(holding => ({
      _id: holding._id,
      symbol: holding.symbol,
      name: holding.name,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      price: holding.price, // current price
      totalPrice: holding.totalPrice,
      status: holding.status,
      BSstatus: holding.BSstatus,
      createdAt: holding.createdAt,
      
      stockId: {
        symbol: holding.symbol,
        name: holding.name,
        currentPrice: holding.price,
        avgPrice: holding.avgPrice
      }
    }));

    res.status(200).json({ 
      success: true,
      data: formattedHoldings,
      count: formattedHoldings.length,
      asOf: todayMidnight.toISOString()
    });

  } catch (err) {
    console.error("Error fetching holdings:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch holdings",
      details: err.message 
    });
  }
};