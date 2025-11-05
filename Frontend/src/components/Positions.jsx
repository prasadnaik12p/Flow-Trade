import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  RefreshCw, 
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Target,
  IndianRupee,
  LogOut
} from 'lucide-react';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('profitLoss');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sellingPosition, setSellingPosition] = useState(null);
  const [sellQuantity, setSellQuantity] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);

  // Position status configuration
  const getStatusConfig = (status) => {
    const configs = {
      open: { label: 'Open', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock }
    };
    return configs[status] || configs.open;
  };

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchPositions();
  }, []);

const fetchPositions = async () => {
  try {
    console.log(" Starting positions fetch...");
    setLoading(true);
    setError(null);
    setIsRefreshing(true);
    
    const token = localStorage.getItem('token');
    
    // Use the CORRECT endpoint - your existing positions endpoint
    const timestamp = Date.now();
    const response = await axios.get(`https://flow-trade.onrender.com/dashboard/UserStock/Positions/?t=${timestamp}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(" API Response received:", response.data);
    
    if (response.data && response.data.success && response.data.data) {
      const apiPositions = response.data.data;
      console.log(` Processing ${apiPositions.length} positions from API`);
      
      // SIMPLE MAPPING
      const mappedPositions = apiPositions.map(position => {
        const quantity = position.quantity || 0;
        const price = position.price || 0;
        const avgPrice = position.avgPrice || price;
        const currentPrice = price;

        const marketValue = quantity * currentPrice;
        const totalInvestment = quantity * avgPrice;
        const profitLoss = marketValue - totalInvestment;

        console.log(` Mapping: ${position.symbol} - Qty: ${quantity}`);

        return {
          _id: position._id,
          stockId: position.stockId?._id || position.stockId,
          symbol: position.symbol || 'N/A',
          name: position.name || 'Unknown Stock',
          quantity: quantity,
          avgPrice: avgPrice,
          currentPrice: currentPrice,
          marketValue: marketValue,
          profitLoss: profitLoss,
          profitLossPercent: totalInvestment > 0 ? (profitLoss / totalInvestment * 100) : 0,
          status: position.status || 'open',
          date: position.date || new Date(),
          BSstatus: 'BUY',
          currentStatus: profitLoss >= 0 ? 'Profit' : 'Loss',
          originalData: position
        };
      });

      console.log(" Final mapped positions:", mappedPositions);
      setPositions(mappedPositions);

    } else {
      console.log(" No valid positions data in response");
      setPositions([]);
      setError('No positions data found');
    }

  } catch (error) {
    console.error(' Fetch positions error:', error);
    setError(`Failed to load positions: ${error.message}`);
    setPositions([]);
  } finally {
    setLoading(false);
    setIsRefreshing(false);
    console.log(" Positions fetch completed");
  }
};

  // Debug function to check current positions
  const debugQuantity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://flow-trade.onrender.com/dashboard/Positions/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(' DEBUG - Current positions from API:', response.data.data);
      
      if (response.data.data && response.data.data.length > 0) {
        response.data.data.forEach(pos => {
          console.log(`${pos.symbol}: Qty=${pos.quantity}, Status=${pos.status}`);
        });
      }
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  // Sell Position Function
  const handleSellClick = (position) => {
    console.log(" Selling position:", {
      positionId: position._id,
      stockId: position.stockId,
      symbol: position.symbol,
      quantity: position.quantity
    });
    
    setSellingPosition(position);
    setSellQuantity(position.quantity.toString());
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

      const currentPrice = sellingPosition.currentPrice;

      const sellOrder = {
        stockId: sellingPosition.stockId,
        qty: quantity,
        price: currentPrice,
        mode: "MARKET",
        limitPrice: currentPrice,
        avgPrice: sellingPosition.avgPrice
      };

      console.log(" Sending sell order:", sellOrder);

      const response = await axios.post('https://flow-trade.onrender.com/dashboard/UserStock/sell', sellOrder, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(" Sell order successful:", response.data);
      
      // 🔹 CRITICAL FIX: Add delay and force refresh
      setShowSellModal(false);
      setSellingPosition(null);
      setSellQuantity('');
      
      // 🔹 Wait a bit for backend to process, then force refresh
      setTimeout(() => {
        console.log(' Fetching updated positions after sell...');
        fetchPositions();
        debugQuantity(); // Debug to see what we're getting
      }, 1000);
      
      setError(` Successfully sold ${quantity} shares of ${sellingPosition.symbol}`);
      setTimeout(() => setError(''), 3000);

    } catch (error) {
      console.error(' Error selling position:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      setError(` Failed to sell position: ${errorMessage}`);
    }
  };

  // Filter and sort positions
  const filteredAndSortedPositions = positions
    .filter(position => {
      const matchesSearch = 
        position.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'marketValue':
          aValue = a.marketValue;
          bValue = b.marketValue;
          break;
        case 'profitLoss':
          aValue = a.profitLoss;
          bValue = b.profitLoss;
          break;
        case 'profitLossPercent':
          aValue = a.profitLossPercent;
          bValue = b.profitLossPercent;
          break;
        default:
          aValue = a.profitLoss;
          bValue = b.profitLoss;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPositions = filteredAndSortedPositions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedPositions.length / itemsPerPage);

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent) => {
    if (percent === null || percent === undefined) return '0.00%';
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportPositions = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Quantity', 'Avg Price (INR)', 'Current Price (INR)', 'Market Value (INR)', 'P&L (INR)', 'P&L %', 'Status', 'Date'],
      ...filteredAndSortedPositions.map(position => [
        position.symbol,
        position.name,
        position.quantity,
        formatCurrency(position.avgPrice),
        formatCurrency(position.currentPrice),
        formatCurrency(position.marketValue),
        formatCurrency(position.profitLoss),
        formatPercent(position.profitLossPercent),
        position.status,
        formatDate(position.date)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `positions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Stats calculation - only count active BUY positions
  const activePositions = positions.filter(p => p.status === 'open');
  const totalPositions = positions.length;
  const totalMarketValue = positions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0);
  const totalProfitLoss = positions.reduce((sum, pos) => sum + (pos.profitLoss || 0), 0);
  const profitablePositions = positions.filter(p => (p.profitLoss || 0) > 0).length;

  // Get status icon component
  const getStatusIcon = (status) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;
    return <IconComponent size={12} className="mr-1" />;
  };

  // Get BS status badge
  const getBSStatusBadge = (status) => {
    const configs = {
      BUY: { label: 'BUY', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    };
    const config = configs[status] || configs.BUY;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {status}
      </span>
    );
  };

  // Get profit/loss status badge
  const getPLStatusBadge = (status) => {
    const configs = {
      Profit: { label: 'Profit', color: 'bg-green-100 text-green-800 border-green-200' },
      Loss: { label: 'Loss', color: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = configs[status] || configs.Profit;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {status}
      </span>
    );
  };

  // Sell Modal Component
  const SellModal = () => {
    if (!showSellModal || !sellingPosition) return null;

    const totalValue = (parseInt(sellQuantity) || 0) * sellingPosition.currentPrice;

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
            <h3 className="text-lg font-bold text-gray-900">Sell Position</h3>
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
                <div className="font-semibold text-gray-900">{sellingPosition.symbol}</div>
                <div className="text-sm text-gray-600">{sellingPosition.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatCurrency(sellingPosition.currentPrice)}</div>
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
                    (sellingPosition.currentPrice - sellingPosition.avgPrice) * parseInt(sellQuantity) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency((sellingPosition.currentPrice - sellingPosition.avgPrice) * parseInt(sellQuantity))}
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

  // Mobile Card View
  const MobilePositionCard = ({ position }) => {
    const statusConfig = getStatusConfig(position.status);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">{position.symbol}</span>
              {getBSStatusBadge(position.BSstatus)}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                {getStatusIcon(position.status)}
                {position.status}
              </span>
            </div>
            <div className="text-xs text-gray-500">{position.name}</div>
          </div>
          <div className={`flex items-center ${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {position.profitLoss >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <div className="text-xs text-gray-500">Quantity</div>
            <div className="text-gray-900">{position.quantity}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Price</div>
            <div className="text-gray-900">{formatCurrency(position.avgPrice)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Current Price</div>
            <div className="text-gray-900">{formatCurrency(position.currentPrice)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Value</div>
            <div className="text-gray-900 font-medium">{formatCurrency(position.marketValue)}</div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-xs text-gray-500">P&L</div>
              <div className={`text-sm font-semibold ${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(position.profitLoss)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">P&L %</div>
              <div className={`text-sm font-semibold ${position.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(position.profitLossPercent)}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Date: {formatDate(position.date)}
            </div>
            <div className="flex gap-2">
              {getPLStatusBadge(position.currentStatus)}
              {/* Sell button shows for ALL positions with quantity > 0 */}
              {position.quantity > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSellClick(position)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                  <LogOut size={12} />
                  Sell
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading Component
  const LoadingSpinner = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200"
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
          Loading positions...
        </motion.p>
      </div>
    </motion.div>
  );

  // Error Component
  const ErrorDisplay = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="text-center max-w-sm w-full">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Issue</h3>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPositions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && positions.length === 0) {
    return <ErrorDisplay />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen bg-gray-50/30 p-3 sm:p-4 lg:p-6"
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Current Positions</h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mt-1 text-sm"
              >
                All prices shown in Indian Rupees (INR) - Real-time from your portfolio
              </motion.p>
              {error && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-xs">⚠️ {error}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsRefreshing(true);
                  fetchPositions();
                }}
                disabled={isRefreshing}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Force Refresh</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportPositions}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { 
                label: 'Total Positions', 
                value: totalPositions, 
                icon: Package, 
                color: 'blue',
                change: null
              },
              { 
                label: 'Active Holdings', 
                value: activePositions.length, 
                icon: Target, 
                color: 'green',
                change: null
              },
              { 
                label: 'Profitable', 
                value: profitablePositions, 
                icon: TrendingUp, 
                color: 'green',
                change: null
              },
              { 
                label: 'Total P&L', 
                value: formatCurrency(totalProfitLoss), 
                icon: BarChart3, 
                color: totalProfitLoss >= 0 ? 'green' : 'red',
                change: totalMarketValue > 0 ? formatPercent((totalProfitLoss / totalMarketValue) * 100) : '0.00%'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs ${stat.change.includes('+') ? 'text-green-600' : stat.change.includes('-') ? 'text-red-600' : 'text-gray-600'} mt-1`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-2 ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'red' ? 'bg-red-100' : 'bg-purple-100'} rounded-lg`}>
                    <stat.icon className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'red' ? 'text-red-600' : 'text-purple-600'}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Market Value Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Portfolio Value</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(totalMarketValue)}</p>
                <p className="text-sm opacity-90 mt-1">
                  {profitablePositions} of {totalPositions} holdings profitable
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <IndianRupee className="h-8 w-8" />
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search positions by symbol or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="profitLoss">Sort by P&L</option>
                  <option value="profitLossPercent">Sort by P&L %</option>
                  <option value="symbol">Sort by Symbol</option>
                  <option value="quantity">Sort by Quantity</option>
                  <option value="marketValue">Sort by Market Value</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Positions Table/Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Table Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  All Positions ({positions.length})
                </h3>
                <div className="text-xs sm:text-sm text-gray-500">
                  Showing {Math.min(currentPositions.length, itemsPerPage)} of {filteredAndSortedPositions.length} positions
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            {isMobile ? (
              <div className="p-3">
                <AnimatePresence>
                  {currentPositions.map((position, index) => (
                    <MobilePositionCard key={position._id} position={position} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Desktop Table View */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol / Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type / Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Price (INR)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price (INR)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market Value (INR)
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('profitLoss')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>P&L (INR)</span>
                          {sortBy === 'profitLoss' && (
                            sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('profitLossPercent')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>P&L %</span>
                          {sortBy === 'profitLossPercent' && (
                            sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {currentPositions.map((position, index) => {
                        const statusConfig = getStatusConfig(position.status);
                        return (
                          <motion.tr
                            key={position._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{position.symbol}</div>
                              <div className="text-xs text-gray-500">{position.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                {getBSStatusBadge(position.BSstatus)}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                  {getStatusIcon(position.status)}
                                  {position.status}
                                </span>
                                {getPLStatusBadge(position.currentStatus)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{position.quantity}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(position.avgPrice)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(position.currentPrice)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(position.marketValue)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`text-sm font-semibold ${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(position.profitLoss)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`text-sm font-semibold ${position.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(position.profitLossPercent)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {/* Sell button shows for ALL positions with quantity > 0 */}
                              {position.quantity > 0 ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSellClick(position)}
                                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                  <LogOut size={14} />
                                  Sell
                                </motion.button>
                              ) : (
                                <span className="text-xs text-gray-500">Closed</span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {currentPositions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No matching positions found' : 'No active positions'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'You don\'t have any active positions in your portfolio.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
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

export default Positions;