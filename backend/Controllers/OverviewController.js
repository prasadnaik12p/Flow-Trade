const { User } = require("../models/UserModel");
const { UserStockModel } = require("../models/UserStockModel");
const { Order } = require("../models/OrdersModel");
const { HoldingModel } = require("../models/HoldingModel");
const { Position } = require("../models/PositionModel");
const { WatchlistModel } = require("../models/WatchlistModel");

module.exports.getAccountOverview = async (req, res) => {
  try {
      const currentUser = req.currentUser;
      console.log(currentUser);
    const userId = currentUser.id;

    // 1. Get User Basic Info
    const user = await User.findById(userId).select('username email createdAt balance');
    const userFor = await User.findById(userId);
    
    // 2. Get Portfolio Value (Current Holdings)
    const holdings = await UserStockModel.find({
      userId: userId,
      status: "Accepted",
      BSstatus: "BUY"
    });

    let totalInvestment = 0;
    let currentPortfolioValue = 0;
    let unrealizedPL = 0;

    holdings.forEach(stock => {
      totalInvestment += stock.avgPrice * stock.quantity;
      // Using current price for portfolio value calculation
      currentPortfolioValue += stock.price * stock.quantity;
    });

    unrealizedPL = currentPortfolioValue - totalInvestment;

    // Get Today's P&L from Positions
    const today = new Date();
    const sessionStart = new Date(today);
    sessionStart.setDate(today.getDate() - 1);
    sessionStart.setHours(15, 0, 0, 0);

    const sessionEnd = new Date(today);
    sessionEnd.setHours(15, 0, 0, 0);

    const todayPositions = await Position.find({
      date: { $gte: sessionStart, $lt: sessionEnd }
    }).populate({
      path: "stockId",
      match: { userId: userId }
    });

    const userTodayPositions = todayPositions.filter(p => p.stockId !== null);
    let todayPL = 0;
    userTodayPositions.forEach(position => {
      todayPL += position.totalPrice;
    });

    // Get Available Cash Balance (assuming from user model)
    const availableCash = userFor.virtualBalance|| 0;

    // Get Watchlist Count
    const watchlistCount = await WatchlistModel.countDocuments({ userId: userId });

    // Get Today's Orders Count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrdersCount = await Order.countDocuments({
      userId: userId,
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    // Get Pending Orders
    const pendingOrders = await Order.find({
      userId: userId,
      status: "Pending"
    }).sort({ createdAt: -1 });

    // Recent Activity (Last 5 orders)
    const recentActivity = await Order.find({
      userId: userId
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('symbol name qty price mode BSstatus status createdAt');

    // Portfolio Allocation by Stock
    const portfolioAllocation = holdings.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity,
      avgPrice: stock.avgPrice,
      currentPrice: stock.price,
      value: stock.price * stock.quantity,
      percentage: ((stock.price * stock.quantity) / currentPortfolioValue) * 100
    }));

    // Response Data
    const accountOverview = {
      userInfo: {
        username: user.username,
        email: user.email,
        memberSince: user.createdAt
      },
      portfolio: {
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        currentValue: Math.round(currentPortfolioValue * 100) / 100,
        unrealizedPL: Math.round(unrealizedPL * 100) / 100,
        unrealizedPLPercentage: totalInvestment > 0 ? Math.round((unrealizedPL / totalInvestment) * 100 * 100) / 100 : 0
      },
      today: {
        profitLoss: Math.round(todayPL * 100) / 100,
        ordersPlaced: todayOrdersCount
      },
      account: {
        availableCash: Math.round(availableCash * 100) / 100,
        totalValue: Math.round((availableCash + currentPortfolioValue) * 100) / 100,
        watchlistCount: watchlistCount
      },
      pendingOrders: pendingOrders.map(order => ({
        id: order._id,
        symbol: order.symbol,
        name: order.name,
        type: order.mode,
        action: order.BSstatus,
        quantity: order.qty,
        price: order.price,
        limitPrice: order.limitPrice,
        createdAt: order.createdAt
      })),
      recentActivity: recentActivity.map(activity => ({
        id: activity._id,
        symbol: activity.symbol,
        action: activity.BSstatus,
        type: activity.mode,
        quantity: activity.qty,
        price: activity.price,
        status: activity.status,
        time: activity.createdAt
      })),
      portfolioAllocation: portfolioAllocation
    };

    res.json({
      success: true,
      data: accountOverview
    });

  } catch (err) {
    console.error("Account overview error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch account overview",
      details: err.message
    });
  }
};

module.exports.getDashboardStats = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const userId = currentUser.id;

    // Quick stats for dashboard 
    const [
      totalHoldings,
      pendingOrdersCount,
      watchlistCount,
      todayOrders
    ] = await Promise.all([
      UserStockModel.countDocuments({ 
        userId: userId, 
        status: "Accepted", 
        BSstatus: "BUY" 
      }),
      Order.countDocuments({
        userId: userId, 
        status: "Pending" 
      }),
      WatchlistModel.countDocuments({ userId: userId }),
      Order.countDocuments({ 
        userId: userId,
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        }
      })
    ]);

    // Get total portfolio value
    const holdings = await UserStockModel.find({
      userId: userId,
      status: "Accepted",
      BSstatus: "BUY"
    });

    let portfolioValue = 0;
    holdings.forEach(stock => {
      portfolioValue += stock.price * stock.quantity;
    });

    const dashboardStats = {
      totalHoldings: totalHoldings,
      pendingOrders: pendingOrdersCount,
      watchlistItems: watchlistCount,
      todayOrders: todayOrders,
      portfolioValue: Math.round(portfolioValue * 100) / 100
    };

    res.json({
      success: true,
      data: dashboardStats
    });

  } catch (err) {
    console.error("Dashboard stats error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard stats"
    });
  }
};