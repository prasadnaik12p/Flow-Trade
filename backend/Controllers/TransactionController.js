const { Transaction } = require("../models/TransactionModel");
const { User } = require("../models/UserModel");

// 🔹 Get all transactions for user
module.exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { type, page = 1, limit = 20 } = req.query;

    let query = { userId };

    // Filter by transaction type if provided
    if (type && type !== "all") {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions: transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTransactions: total,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
      details: error.message,
    });
  }
};

// 🔹 Get transaction by ID
module.exports.getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.currentUser.id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId: userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      transaction: transaction,
    });
  } catch (error) {
    console.error(" Get transaction by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction",
      details: error.message,
    });
  }
};

// 🔹 Get transaction statistics
module.exports.getTransactionStats = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { period = "month" } = req.query; // day, week, month, year

    const now = new Date();
    let startDate;

    switch (period) {
      case "day":
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get transaction counts by type
    const transactionCounts = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Get recent activity
    const recentTransactions = await Transaction.find({
      userId: userId,
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate net flow (deposits - withdrawals)
    const netFlow = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
          type: { $in: ["deposit", "withdrawal", "trade_buy", "trade_sell"] },
        },
      },
      {
        $group: {
          _id: null,
          totalInflow: {
            $sum: {
              $cond: [
                { $in: ["$type", ["deposit", "trade_sell"]] },
                "$amount",
                0,
              ],
            },
          },
          totalOutflow: {
            $sum: {
              $cond: [
                { $in: ["$type", ["withdrawal", "trade_buy"]] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = netFlow[0] || { totalInflow: 0, totalOutflow: 0 };

    res.json({
      success: true,
      stats: {
        transactionCounts: transactionCounts,
        recentTransactions: recentTransactions,
        totalInflow: stats.totalInflow,
        totalOutflow: stats.totalOutflow,
        netFlow: stats.totalInflow - stats.totalOutflow,
        period: period,
        startDate: startDate,
      },
    });
  } catch (error) {
    console.error(" Get transaction stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction statistics",
      details: error.message,
    });
  }
};

// 🔹 Export transactions (CSV)
module.exports.exportTransactions = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { startDate, endDate } = req.query;

    let query = { userId };

    // Date range filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    // Convert to CSV format
    // Convert to CSV format with comprehensive error handling
    const csvData = transactions
      .filter((t) => t !== undefined && t !== null) // Remove undefined/null transactions
      .map((t) => ({
        Date: t.createdAt
          ? t.createdAt.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        Type: t.type || "Unknown",
        Description: t.description || "",
        Amount: t.amount || 0,
        Currency: t.currency || "USD",
        "Balance Before": t.balanceBefore || 0,
        "Balance After": t.balanceAfter || 0,
      }));

    res.json({
      success: true,
      transactions: csvData,
      format: "csv",
      count: transactions.length,
    });
  } catch (error) {
    console.error(" Export transactions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export transactions",
      details: error.message,
    });
  }
};
