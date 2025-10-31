
const { User } = require('../models/UserModel');
const { Payment } = require('../models/PaymentModel');
const {Transaction} = require('../models/TransactionModel');






//  Get User Balance  (Done)
module.exports.getBalance = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      virtualBalance: user.virtualBalance,
      totalDeposited: user.totalDeposited,
      totalWithdrawn: user.totalWithdrawn,
      currency: 'inr'
    });

  } catch (error) {
    console.error(' Get balance error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch balance', 
      details: error.message 
    });
  }
};

//  Get Payment History (done)
module.exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      payments: payments,
      transactions: transactions
    });

  } catch (error) {
    console.error(' Get payment history error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch payment history', 
      details: error.message 
    });
  }
};



//  Quick Add Funds (Done)
module.exports.quickAddFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(amount);
    const userId = req.currentUser.id;

    
   

    const user = await User.findById(userId);
    const balanceBefore = user.virtualBalance;

    // Add virtual money directly
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        virtualBalance: amount,
        totalDeposited: amount
      }
    });

    // Record transaction
    await Transaction.create({
      userId: userId,
      type: 'deposit',
      amount: amount,
      currency: 'inr',
      balanceBefore: balanceBefore,
      balanceAfter: balanceBefore + amount,
      description: `Quick added ₹${amount} virtual money`,
      metadata: { sandbox: true }
    });

    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: `₹${amount} virtual money added successfully!`,
      newBalance: updatedUser.virtualBalance,
      sandbox: true
    });

  } catch (error) {
    console.error(' Quick add funds error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add funds', 
      details: error.message 
    });
  }
};