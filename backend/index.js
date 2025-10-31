require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const authRoute = require('./Routes/AuthRoute');
const { StockModel } = require("./models/StockModel");
const { startPoller } = require("./utils/limitOrderPoller");



//Importing Routes
const HoldingRoute = require("./Routes/HoldingRoute");
const PositionRoute = require("./Routes/PositionRoute");
const WatchlistRoute = require("./Routes/WatchlistRoute");
const OrderRoute = require("./Routes/OrderRoute");
const StockRoute = require("./Routes/StocksRoute");
const UserStockRoute = require("./Routes/UserStockRoute");
const OverViewRoute = require("./Routes/OverviewRoute");
const priceRoutes = require('./Routes/priceRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const authMiddleware = require("./middleware/authMiddleware");

main().then(() => console.log("Database connected"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("OK OK");
});

//Routes
app.use("/auth", authRoute);
app.use('/dashboard/allHoldings', authMiddleware,HoldingRoute)
app.use('/dashboard/Positions',authMiddleware, PositionRoute);
app.use("/dashboard/Watchlists", authMiddleware,WatchlistRoute)
app.use("/dashboard/Orders", authMiddleware,OrderRoute);
app.use("/dashboard/stocks", authMiddleware,StockRoute);
app.use("/dashboard/UserStock", authMiddleware,UserStockRoute);
app.use("/dashboard/Overview", authMiddleware, OverViewRoute);
app.use('/dashboard', authMiddleware, priceRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);








startPoller();





app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        message: message,
        
    });
});

app.listen(PORT, () => {
    console.log(`Server is listining the Port ${PORT}`);
});