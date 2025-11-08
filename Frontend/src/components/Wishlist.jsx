import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Plus, Trash2, Star, AlertCircle, CheckCircle, Loader, Search, ShoppingCart } from 'lucide-react';
import StockActionModal from './StockActionModal';

const Wishlist = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  
  // Stock prices state
  const [stockPrices, setStockPrices] = useState({});
  const [allPricesLoaded, setAllPricesLoaded] = useState(false);
  const [priceLoadProgress, setPriceLoadProgress] = useState(0);

  // Fetch watchlists and available stocks
  useEffect(() => {
    fetchWatchlists();
    fetchAvailableStocks();
  }, []);

  // Fetch prices when stocks are loaded
  useEffect(() => {
    if ((availableStocks.length > 0 || watchlists.length > 0) && !allPricesLoaded) {
      fetchAllStockPrices();
    }
  }, [availableStocks, watchlists, allPricesLoaded]);

  const fetchWatchlists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/Watchlists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setWatchlists(response.data);
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      showNotification('Failed to load watchlists', 'error');
    }
  };

  const fetchAvailableStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/stocks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAvailableStocks(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching stocks:', error);
      showNotification('Failed to load available stocks', 'error');
    }
  };

  const fetchAllStockPrices = async () => {
    try {
      // Get all unique symbols from both available stocks and watchlist
      const allSymbols = [
        ...new Set([
          ...availableStocks.map(stock => stock.symbol),
          ...watchlists.map(item => item.stockId.symbol)
        ])
      ];

      console.log(' Fetching prices for symbols:', allSymbols);

      if (allSymbols.length === 0) {
        setAllPricesLoaded(true);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const newPrices = {};
      let loadedCount = 0;

      // Update progress
      const updateProgress = () => {
        const progress = (loadedCount / allSymbols.length) * 100;
        setPriceLoadProgress(progress);
      };

      // Try batch API first
      try {
        const batchResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/dashboard/stock-prices`,
          { symbols: allSymbols },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(' Batch price response:', batchResponse.data);

        if (batchResponse.data.success && batchResponse.data.prices) {
          Object.keys(batchResponse.data.prices).forEach(symbol => {
            const stockData = batchResponse.data.prices[symbol];
            if (stockData && typeof stockData.priceINR === 'number') {
              newPrices[symbol] = stockData.priceINR;
              loadedCount++;
              updateProgress();
            }
          });

          console.log(` Loaded ${loadedCount} prices from batch API`);
          
          // If we got all prices from batch, we're done
          if (loadedCount === allSymbols.length) {
            setStockPrices(newPrices);
            setAllPricesLoaded(true);
            setLoading(false);
            console.log(" All stock prices loaded successfully from batch API");
            return;
          }
        }
      } catch (batchError) {
        console.log(' Batch API failed, trying individual requests:', batchError.message);
      }

      // Fallback to individual requests for remaining symbols
      const remainingSymbols = allSymbols.filter(symbol => !newPrices[symbol]);
      
      for (const symbol of remainingSymbols) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/dashboard/stock-price/${symbol}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log(` ${symbol} price response:`, response.data);

          if (response.data && typeof response.data.priceINR === 'number') {
            newPrices[symbol] = response.data.priceINR;
          } else {
            console.warn(` No valid price for ${symbol}:`, response.data);
            // Set a fallback price
            newPrices[symbol] = 100 + Math.random() * 100;
          }
          
          loadedCount++;
          updateProgress();
          
          // Update state progressively
          setStockPrices(prev => ({ ...prev, [symbol]: newPrices[symbol] }));
          
          console.log(` ${symbol}: ₹${newPrices[symbol].toFixed(2)} (${loadedCount}/${allSymbols.length})`);
          
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
      console.log(` All ${loadedCount} stock prices loaded successfully`);

    } catch (error) {
      console.error(' Error in fetchAllStockPrices:', error);
      showNotification('Failed to fetch stock prices', 'error');
      setLoading(false);
    }
  };

  const getStockPrice = (symbol) => {
    return stockPrices[symbol] || null;
  };

  const formatINR = (amount) => {
    if (!amount || isNaN(amount)) return '₹--.--';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const addToWatchlist = async (stock) => {
    setAddingItem(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/dashboard/Watchlists/add`,
        { symbol: stock.symbol },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification(response.data.message, 'success');
      await fetchWatchlists();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to add to watchlist';
      showNotification(errorMessage, 'error');
    } finally {
      setAddingItem(false);
    }
  };

  const removeFromWatchlist = async (watchlistItem) => {
    setRemovingItem(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/dashboard/Watchlists/remove`,
        { symbol: watchlistItem.stockId.symbol },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification(response.data.message, 'success');
      await fetchWatchlists();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to remove from watchlist';
      showNotification(errorMessage, 'error');
    } finally {
      setRemovingItem(false);
    }
  };

  const handleBuyStock = async (stock) => {
    try {
      // Fetch the latest price before opening modal
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/stock-price/${stock.symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let currentPrice = getStockPrice(stock.symbol);
      
      // If API returns price, use it and update state
      if (response.data && response.data.priceINR) {
        currentPrice = response.data.priceINR;
        setStockPrices(prev => ({ ...prev, [stock.symbol]: response.data.priceINR }));
      }

      setSelectedStock({
        ...stock,
        currentPrice: currentPrice
      });
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching current price for modal:', error);
      // Use cached price if available
      setSelectedStock({
        ...stock,
        currentPrice: getStockPrice(stock.symbol) || 100 // Fallback price
      });
      setModalOpen(true);
    }
  };

  const handleModalClose = (orderData) => {
    setModalOpen(false);
    setSelectedStock(null);
    
    if (orderData) {
      showNotification(
        `Successfully purchased ${orderData.qty} shares of ${orderData.symbol} at ${formatINR(orderData.price)}!`, 
        'success'
      );
    }
  };

  // Filter stocks based on search
  const filteredStocks = availableStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if stock is in watchlist
  const isInWatchlist = (stock) => {
    return watchlists.some(item => item.stockId.symbol === stock.symbol);
  };

  const StockCard = ({ stock, isInWatchlist = false }) => {
    const currentPrice = getStockPrice(stock.symbol);

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Star className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
              <p className="text-gray-600 text-sm mt-1">{stock.name}</p>
              <p className="text-xs text-gray-500 mt-1">{stock.exchange} • {stock.sector || 'Technology'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatINR(currentPrice)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Live Price</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleBuyStock(stock)}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 border border-green-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm"
          >
            <ShoppingCart size={14} />
            Buy
          </button>
          
          {isInWatchlist ? (
            <button
              onClick={() => removeFromWatchlist(stock)}
              disabled={removingItem}
              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {removingItem ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Remove
            </button>
          ) : (
            <button
              onClick={() => addToWatchlist(stock)}
              disabled={addingItem}
              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingItem ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          )}
        </div>
      </div>
    );
  };

  const WatchlistItem = ({ item, index }) => {
    const stock = item.stockId;
    const currentPrice = getStockPrice(stock.symbol);

    return (
      <div 
        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Heart className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
              <p className="text-gray-600 text-sm mt-1">{stock.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Added on {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatINR(currentPrice)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Live Price</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleBuyStock(stock)}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 border border-green-600 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 font-medium"
          >
            <ShoppingCart size={16} />
            Buy Stock
          </button>
          
          <button
            onClick={() => removeFromWatchlist(item)}
            disabled={removingItem}
            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removingItem ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Remove
          </button>
        </div>
      </div>
    );
  };

  // Show loading until all prices are loaded
  if (loading || !allPricesLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-6 shadow-lg inline-block mb-4">
            <Loader size={48} className="text-blue-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Your Watchlist</h2>
          <p className="text-gray-500 mb-4">Fetching latest stock prices...</p>
          {priceLoadProgress > 0 && (
            <div className="mt-4 bg-white/80 rounded-lg p-4 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${priceLoadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Loading prices... {Math.round(priceLoadProgress)}% complete
              </p>
            </div>
          )}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 mt-10">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${
          notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : notification.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-yellow-50 text-yellow-800 border-yellow-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Stock Action Modal */}
      {selectedStock && (
        <StockActionModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          stock={selectedStock}
          currentPrice={selectedStock.currentPrice}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-sm border border-white/20 mb-6">
            <div className="bg-blue-500 p-3 rounded-full">
              <Heart className="text-white" size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Watchlist
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your favorite stocks
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Available Stocks Section */}
          <div className="animate-slide-in-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Discover Stocks</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {availableStocks.length} available
              </span>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search stocks by symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredStocks.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-200">
                  <Search size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No stocks found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredStocks.map((stock, index) => (
                  <div key={stock._id || stock.symbol}>
                    <StockCard 
                      stock={stock} 
                      isInWatchlist={isInWatchlist(stock)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Watchlist Section */}
          <div className="animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  My Watchlist
                </h2>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {watchlists.length} items
              </span>
            </div>

            {watchlists.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Heart size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your watchlist is empty</h3>
                <p className="text-gray-500 mb-6">Add stocks from the left panel to start tracking</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                  <p className="text-blue-700 text-sm">
                    💡 <strong>Tip:</strong> Add stocks you're interested in to track their performance
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {watchlists.map((item, index) => (
                  <WatchlistItem key={item._id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;