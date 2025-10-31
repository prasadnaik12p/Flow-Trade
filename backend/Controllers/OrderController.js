const { Order } = require("../models/OrdersModel");

module.exports.allOrders = async (req, res) => {
   const currentUser = req.currentUser;
   console.log("Fetching all orders for user:", currentUser);
   if(!currentUser){
      return res.status(401).json({ message: "Unauthorized" });
   }

   if (!currentUser.id) {
      return res.status(400).json({ message: "Invalid user ID" });
   }

   console.log("Current User:", currentUser);
   let allOrders = await Order.find({ userId: currentUser.id }).populate('userId', 'username email').exec();
   res.json(allOrders);
    
};