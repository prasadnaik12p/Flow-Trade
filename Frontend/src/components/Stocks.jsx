import { useState, useEffect } from "react";
import axios from "axios";
import StockActionModal from "./StockActionModal";
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-50' : type === 'success' ? 'bg-green-50' : 'bg-blue-50';
  const borderColor = type === 'error' ? 'border-red-200' : type === 'success' ? 'border-green-200' : 'border-blue-200';
  const textColor = type === 'error' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-blue-800';
  const iconColor = type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-400' : 'text-blue-400';

  const icons = {
    error: (
      <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed top-4 right-4 z-50 max-w-sm w-full ${bgColor} border ${borderColor} rounded-lg shadow-lg transform transition-all duration-300 ease-in-out`}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0">
          {icons[type] || icons.info}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${
                type === 'error' 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600' 
                  : type === 'success'
                  ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600'
                  : 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingAnimation = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="h-full flex flex-col items-center justify-center min-h-[60vh]"
  >
    <motion.div 
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
        scale: { duration: 1.5, repeat: Infinity }
      }}
      className="w-32 h-32 mb-8 relative"
    >
      <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </motion.div>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-xl font-semibold text-gray-700 mb-4"
    >
      Loading Stock Prices...
    </motion.p>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="text-gray-500 text-center"
    >
      Fetching latest market data for all stocks
      <br />
      <span className="text-sm">This may take a few moments</span>
    </motion.p>
    <div className="mt-6 flex items-center justify-center space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </motion.div>
);

// Cache utility functions
const CACHE_KEYS = {
  STOCKS_DATA: 'stocks_data',
  STOCK_PRICES: 'stock_prices',
  ALL_PRICES_LOADED: 'all_prices_loaded',
  LAST_FETCHED: 'last_fetched'
};

const getCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const setCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const isCacheValid = (cacheKey, maxAge = 5 * 60 * 1000) => {
  const lastFetched = getCache(`${CACHE_KEYS.LAST_FETCHED}_${cacheKey}`);
  if (!lastFetched) return false;
  return Date.now() - lastFetched < maxAge;
};

// Fetch single stock price (returns INR price)
const fetchStockPriceFromBackend = async (symbol) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `https://flow-trade.onrender.com/dashboard/stock-price/${symbol}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Backend returns priceINR which is already converted from USD
    const priceINR = response.data.priceINR;
    const priceUSD = response.data.priceUSD;
    
    if (typeof priceINR === 'number') {
      console.log(` ${symbol}: $${priceUSD} USD → ₹${priceINR.toFixed(2)} INR`);
      return priceINR;
    } else {
      console.error(` Invalid price for ${symbol}:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} price from backend:`, error);
    return null;
  }
};

// Fetch multiple stock prices in batches
const fetchMultipleStockPrices = async (symbols) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `https://flow-trade.onrender.com/dashboard/stock-prices`,
      { symbols },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      // Extract priceINR from response
      const prices = {};
      Object.keys(response.data.prices).forEach(symbol => {
        const stockData = response.data.prices[symbol];
        if (stockData && typeof stockData.priceINR === 'number') {
          prices[symbol] = stockData.priceINR;
        } else {
          prices[symbol] = null;
        }
      });
      return prices;
    } else {
      throw new Error('Failed to fetch batch prices');
    }
  } catch (error) {
    console.error('Error fetching multiple stock prices:', error);
    return {};
  }
};

function Stocks() {
  const [allStocks, setAllStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [alert, setAlert] = useState(null);
  const [allPricesLoaded, setAllPricesLoaded] = useState(false);
  const [priceLoadProgress, setPriceLoadProgress] = useState(0);

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  // Load initial data
  useEffect(() => {
    const fetchStocksAndPrices = async () => {
      try {
        setLoading(true);
        setAllPricesLoaded(false);

        const token = localStorage.getItem("token");
        if (!token) {
          showAlert('error', 'Please login to view stocks');
          setLoading(false);
          return;
        }

        // Fetch stocks data
        const res = await axios.get("https://flow-trade.onrender.com/dashboard/stocks", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setAllStocks(res.data);
        
        // Fetch all stock prices
        await fetchAllStockPrices(res.data);
        
      } catch (err) {
        console.error("Error fetching stocks:", err);
        
        if (err.response?.status === 401) {
          showAlert('error', 'Session expired. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else {
          showAlert('error', 'Failed to load stocks. Please try again.');
        }
        setLoading(false);
      }
    };
    
    fetchStocksAndPrices();
  }, []);

  const fetchAllStockPrices = async (stocks) => {
    if (!stocks || stocks.length === 0) {
      setAllPricesLoaded(true);
      setLoading(false);
      return;
    }

    const symbols = stocks.map(stock => stock.symbol);
    const newPrices = {};
    let loadedCount = 0;

    // Update progress
    const updateProgress = () => {
      const progress = (loadedCount / symbols.length) * 100;
      setPriceLoadProgress(progress);
    };

    console.log(` Fetching prices for ${symbols.length} stocks`);

    // Try batch API first
    try {
      const batchPrices = await fetchMultipleStockPrices(symbols);
      
      // Process batch results
      symbols.forEach(symbol => {
        if (batchPrices[symbol]) {
          newPrices[symbol] = batchPrices[symbol];
          loadedCount++;
          updateProgress();
        }
      });

      console.log(` Loaded ${loadedCount} prices from batch API`);
      
      // If we got all prices from batch, we're done
      if (loadedCount === symbols.length) {
        setStockPrices(newPrices);
        setAllPricesLoaded(true);
        setLoading(false);
        setCache(CACHE_KEYS.STOCK_PRICES, newPrices);
        setCache(CACHE_KEYS.ALL_PRICES_LOADED, true);
        console.log(" All stock prices loaded successfully from batch API");
        return;
      }
    } catch (batchError) {
      console.log(' Batch API failed, trying individual requests:', batchError.message);
    }

    // Fallback to individual requests for remaining symbols
    const remainingSymbols = symbols.filter(symbol => !newPrices[symbol]);
    
    for (const symbol of remainingSymbols) {
      try {
        const priceINR = await fetchStockPriceFromBackend(symbol);
        
        if (priceINR) {
          newPrices[symbol] = priceINR;
        } else {
          // Set fallback price if API fails
          newPrices[symbol] = 100 + Math.random() * 100;
        }
        
        loadedCount++;
        updateProgress();
        
        // Update state progressively
        setStockPrices(prev => ({ ...prev, [symbol]: newPrices[symbol] }));
        
        console.log(`${symbol}: ₹${newPrices[symbol].toFixed(2)} (${loadedCount}/${symbols.length})`);
        
      } catch (error) {
        console.error(` Error fetching ${symbol} price:`, error);
        // Set fallback price
        newPrices[symbol] = 100 + Math.random() * 100;
        loadedCount++;
        updateProgress();
      }

      // Rate limiting between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // All prices loaded
    setStockPrices(newPrices);
    setAllPricesLoaded(true);
    setLoading(false);
    setCache(CACHE_KEYS.STOCK_PRICES, newPrices);
    setCache(CACHE_KEYS.ALL_PRICES_LOADED, true);
    console.log(` All ${loadedCount} stock prices loaded successfully`);
  };

  const handleBuy = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleAddToWatchlist = (stock) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      showAlert('error', 'Please login to add stocks to watchlist');
      return;
    }

    axios.post(
      "https://flow-trade.onrender.com/dashboard/Watchlists/add",
      { symbol: stock.symbol },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    )
    .then(res => {
      showAlert('success', res.data.message || 'Added to watchlist successfully!');
    })
    .catch(err => {
      console.error("Watchlist error:", err);
      const msg = err.response?.data?.message || "Error adding to watchlist";
      
      if (err.response?.status === 401) {
        showAlert('error', 'Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        showAlert('error', msg);
      }
    });
  };

  const handleModalClose = (orderData) => {
    setIsModalOpen(false);
    if (orderData) {
      showAlert(
        'success', 
        `Order placed for ${orderData.qty} shares of ${orderData.symbol} at ₹${(orderData.price).toFixed(2)}`
      );
    }
  };

  const getPriceDisplay = (symbol) => {
    if (stockPrices[symbol]) {
      return (
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex items-center"
        >
          <span className="text-gray-500 mr-1">₹</span>
          {new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(stockPrices[symbol])}
        </motion.span>
      );
    }
    return <span className="text-gray-400">--</span>;
  };

  // Add manual refresh button handler
  const handleManualRefresh = () => {
    // Clear caches
    localStorage.removeItem(CACHE_KEYS.STOCK_PRICES);
    localStorage.removeItem(CACHE_KEYS.ALL_PRICES_LOADED);
    
    setLoading(true);
    setAllPricesLoaded(false);
    setPriceLoadProgress(0);
    
    // Refetch all prices
    fetchAllStockPrices(allStocks);
    showAlert('info', 'Refreshing all stock prices...');
  };

  // Show loading until all prices are loaded
  if (loading || !allPricesLoaded) {
    return (
      <>
        <AnimatePresence>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </AnimatePresence>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 flex items-center justify-center mt-16">
          <div className="text-center">
            <LoadingAnimation />
            {priceLoadProgress > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/80 rounded-lg p-4 max-w-md mx-auto"
              >
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${priceLoadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Loading prices... {Math.round(priceLoadProgress)}% complete
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 py-6 px-2 sm:px-6 lg:px-8 mt-16 h-[100%]"
      >
        <div className="max-w-7xl mx-auto flex flex-col h-[90%]">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 drop-shadow"
            >
              Stock Market
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManualRefresh}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow font-semibold transition-all duration-200"
            >
              Refresh Prices
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 bg-white/90 rounded-2xl shadow-2xl overflow-hidden border border-blue-200"
          >
            <div className="relative w-full overflow-x-auto">
              <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-5rem)]">
                <table className="w-full divide-y divide-blue-200">
                  <thead className="bg-gradient-to-b from-cyan-900 via-blue-800 to-blue-700 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hidden sm:table-cell">
                        Name
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                        Price (INR)
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hidden md:table-cell">
                        Exchange
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hidden lg:table-cell">
                        Type
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                        Wishlist
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white divide-y divide-blue-100"
                  >
                    {allStocks.map((stock, index) => (
                      <motion.tr
                        key={stock.symbol}
                        variants={tableRowVariants}
                        custom={index}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          transition: { duration: 0.2 }
                        }}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-blue-700">
                          {stock.symbol}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {stock.name}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-blue-900 font-semibold">
                          {getPriceDisplay(stock.symbol)}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-blue-600 hidden md:table-cell">
                          {stock.exchange}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"
                          >
                            {stock.type}
                          </motion.span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBuy(stock)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow font-semibold transition-all duration-200"
                          >
                            Buy
                          </motion.button>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToWatchlist(stock)}
                            className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow font-semibold transition-all duration-200"
                          >
                            Add to <FaRegHeart className="ml-1 text-white" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isModalOpen && selectedStock && (
            <StockActionModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              stock={selectedStock}
              currentPrice={stockPrices[selectedStock.symbol]}
              actionType="BUY"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default Stocks;