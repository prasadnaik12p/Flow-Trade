import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Loader, 
  AlertCircle, 
  PieChart,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  LogOut // Sell icon
} from 'lucide-react';

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalInvestment: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0
  });
  const [sellingPosition, setSellingPosition] = useState(null);
  const [sellQuantity, setSellQuantity] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      setError('');
      setIsRefreshing(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const response = await axios.get('http://localhost:3002/dashboard/allHoldings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      
      if (data.success) {
        setHoldings(data.data || []);
        calculatePortfolioStats(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch holdings');
      }
    } catch (err) {
      console.error('Error fetching holdings:', err);
      
      if (err.response) {
        setError(err.response.data?.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('Network error: Unable to connect to server');
      } else {
        setError(err.message || 'Failed to fetch holdings');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Sell Position Function
  const handleSellClick = (holding) => {
    setSellingPosition(holding);
    setSellQuantity(holding.quantity.toString()); // Default to full quantity
    setShowSellModal(true);
  };

const executeSell = async () => {
  if (!sellingPosition || !sellQuantity) return;

  try {
    const token = localStorage.getItem('token');
    const quantity = parseInt(sellQuantity);
    
    if (quantity <= 0 || quantity > sellingPosition.quantity) {
      setError(`Invalid quantity. Maximum available: ${sellingPosition.quantity}`);
      return;
    }

    const currentPrice = sellingPosition.stockId?.currentPrice || sellingPosition.price;
    const totalPriceValue = currentPrice * quantity;

    // 🔹 CORRECTED: Include ALL required fields from backend
    const sellOrder = {
      stockId: sellingPosition._id, // The holding ID
      symbol: sellingPosition.stockId?.symbol || sellingPosition.symbol, // Symbol
      name: sellingPosition.stockId?.name || sellingPosition.name, // Stock name
      qty: quantity, // Quantity to sell
      price: currentPrice, // Current market price
      totalPrice: totalPriceValue, // Total value of the sell order
      mode: "MARKET", // Order type
      limitPrice: currentPrice // For MARKET orders, same as current price
    };

    console.log("📤 Sending sell order:", sellOrder);

    const response = await axios.post('http://localhost:3002/dashboard/UserStock/sell', sellOrder, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Sell order successful:", response.data);
    
    // Success - refresh holdings
    setShowSellModal(false);
    setSellingPosition(null);
    setSellQuantity('');
    fetchHoldings();
    
    // Show success message
    setError(`Successfully sold ${quantity} shares of ${sellingPosition.stockId?.symbol || sellingPosition.symbol}`);
    setTimeout(() => setError(''), 3000);

  } catch (error) {
    console.error('❌ Error selling position:', error);
    setError(`Failed to sell position: ${error.response?.data?.error || error.response?.data?.message || error.message}`);
  }
};

  const calculatePortfolioStats = (holdingsData) => {
    let totalValue = 0;
    let totalInvestment = 0;

    holdingsData.forEach(holding => {
      const currentPrice = holding.stockId?.currentPrice || holding.price || 0;
      const quantity = holding.quantity || 0;
      const avgPrice = holding.avgPrice || holding.price || 0;

      totalValue += currentPrice * quantity;
      totalInvestment += avgPrice * quantity;
    });

    const totalProfitLoss = totalValue - totalInvestment;
    const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    setPortfolioStats({
      totalValue,
      totalInvestment,
      totalProfitLoss,
      profitLossPercentage
    });
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Sell Modal Component
  const SellModal = () => {
    if (!showSellModal || !sellingPosition) return null;

    const totalValue = (parseInt(sellQuantity) || 0) * (sellingPosition.stockId?.currentPrice || sellingPosition.price);
    const symbol = sellingPosition.stockId?.symbol || sellingPosition.symbol;
    const name = sellingPosition.stockId?.name || sellingPosition.name;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setShowSellModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Sell Holding</h3>
            <button
              onClick={() => setShowSellModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <div className="font-semibold text-gray-900">{symbol}</div>
                <div className="text-sm text-gray-600">{name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(sellingPosition.stockId?.currentPrice || sellingPosition.price)}
                </div>
                <div className="text-sm text-gray-600">Current Price</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to Sell (Max: {sellingPosition.quantity})
              </label>
              <input
                type="number"
                min="1"
                max={sellingPosition.quantity}
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter quantity"
              />
            </div>

            {sellQuantity && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total Value:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(totalValue)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-700">Estimated P&L:</span>
                  <span className={`font-semibold ${
                    ((sellingPosition.stockId?.currentPrice || sellingPosition.price) - sellingPosition.avgPrice) * parseInt(sellQuantity) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(
                      ((sellingPosition.stockId?.currentPrice || sellingPosition.price) - sellingPosition.avgPrice) * parseInt(sellQuantity)
                    )}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={executeSell}
                disabled={!sellQuantity || parseInt(sellQuantity) <= 0 || parseInt(sellQuantity) > sellingPosition.quantity}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <LogOut size={16} />
                Sell Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Loading Component
  const LoadingSpinner = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 m-4"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm font-medium"
        >
          Loading your holdings...
        </motion.p>
      </div>
    </motion.div>
  );

  // Error Component
  const ErrorDisplay = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 m-4 p-6"
    >
      <div className="text-center max-w-sm w-full">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Holdings</h3>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchHoldings}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mx-auto text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </motion.button>
      </div>
    </motion.div>
  );

  // Stats Card Component
  const StatsCard = ({ title, value, change, icon: Icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {value}
          </p>
          {change && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={`flex items-center mt-2 ${change.positive ? 'text-green-600' : 'text-red-600'}`}
            >
              {change.positive ? 
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> : 
                <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              }
              <span className="text-xs sm:text-sm font-medium truncate">
                {change.value}
              </span>
            </motion.div>
          )}
        </div>
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 p-2 rounded-lg ml-3 flex-shrink-0 group-hover:bg-blue-100 transition-colors"
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        </motion.div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !error.includes('Successfully')) {
    return <ErrorDisplay />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Portfolio Holdings</h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mt-1 text-sm sm:text-base"
              >
                Overview of your stock investments and performance
              </motion.p>
              {error && error.includes('Successfully') && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-xs">✅ {error}</p>
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchHoldings}
              disabled={isRefreshing}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </motion.div>

          {/* Portfolio Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <StatsCard
              icon={PieChart}
              title="Portfolio Value"
              value={formatCurrency(portfolioStats.totalValue)}
              delay={0.1}
            />
            
            <StatsCard
              icon={DollarSign}
              title="Total Investment"
              value={formatCurrency(portfolioStats.totalInvestment)}
              delay={0.15}
            />
            
            <StatsCard
              icon={TrendingUp}
              title="Total P&L"
              value={formatCurrency(portfolioStats.totalProfitLoss)}
              change={{
                positive: portfolioStats.totalProfitLoss >= 0,
                value: formatPercentage(portfolioStats.profitLossPercentage)
              }}
              delay={0.2}
            />
            
            <StatsCard
              icon={Package}
              title="Total Holdings"
              value={holdings.length}
              delay={0.25}
            />
          </motion.div>

          {/* Holdings Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Your Holdings</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                    {holdings.length} stocks
                  </span>
                </div>
              </div>
            </div>

            {holdings.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Package className="mx-auto text-gray-400 mb-4 h-12 w-12 sm:h-16 sm:w-16" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No holdings yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm sm:text-base">
                  Your stock holdings will appear here once you make your first purchase.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block max-w-sm">
                  <p className="text-blue-700 text-xs sm:text-sm">
                    💡 <strong>Tip:</strong> Start building your portfolio by buying stocks from the Stocks page
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Price
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Price
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Value
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          P&L
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {holdings.map((holding, index) => {
                        const currentPrice = holding.stockId?.currentPrice || holding.price || 0;
                        const quantity = holding.quantity || 0;
                        const avgPrice = holding.avgPrice || holding.price || 0;
                        const investment = avgPrice * quantity;
                        const currentValue = currentPrice * quantity;
                        const profitLoss = currentValue - investment;
                        const profitLossPercentage = investment > 0 ? (profitLoss / investment) * 100 : 0;

                        return (
                          <motion.tr 
                            key={holding._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {holding.stockId?.symbol || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {holding.stockId?.name || 'Unknown Stock'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {quantity}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(avgPrice)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(currentPrice)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(investment)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(currentValue)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                <div>{formatCurrency(profitLoss)}</div>
                                <div className="text-xs">
                                  {formatPercentage(profitLossPercentage)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSellClick(holding)}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <LogOut size={14} />
                                Sell
                              </motion.button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3 p-4">
                  {holdings.map((holding, index) => {
                    const currentPrice = holding.stockId?.currentPrice || holding.price || 0;
                    const quantity = holding.quantity || 0;
                    const avgPrice = holding.avgPrice || holding.price || 0;
                    const investment = avgPrice * quantity;
                    const currentValue = currentPrice * quantity;
                    const profitLoss = currentValue - investment;
                    const profitLossPercentage = investment > 0 ? (profitLoss / investment) * 100 : 0;

                    return (
                      <motion.div
                        key={holding._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-800 truncate">
                              {holding.stockId?.symbol || 'N/A'}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                              {holding.stockId?.name || 'Unknown Stock'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            profitLoss >= 0 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {formatPercentage(profitLossPercentage)}
                          </span>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Quantity</p>
                            <p className="font-medium text-gray-900">{quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Avg. Price</p>
                            <p className="font-medium text-gray-900">{formatCurrency(avgPrice)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Current Price</p>
                            <p className="font-medium text-gray-900">{formatCurrency(currentPrice)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Investment</p>
                            <p className="font-medium text-gray-900">{formatCurrency(investment)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Current Value</p>
                            <p className="font-medium text-gray-900 text-lg">{formatCurrency(currentValue)}</p>
                          </div>
                          <div className="col-span-2 border-t border-gray-100 pt-2">
                            <p className="text-gray-500 text-xs">Profit & Loss</p>
                            <p className={`font-bold text-lg ${
                              profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(profitLoss)}
                            </p>
                          </div>
                        </div>

                        {/* Sell Button for Mobile */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSellClick(holding)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <LogOut size={14} />
                            Sell Position
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Sell Modal */}
      <AnimatePresence>
        <SellModal />
      </AnimatePresence>
    </>
  );
};

export default Holdings;