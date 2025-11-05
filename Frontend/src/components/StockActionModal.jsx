import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Alert Component - Updated for top center position
const Alert = ({ type, message, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-blue-50';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-blue-200';
  const textColor = type === 'error' ? 'text-red-800' : 'text-blue-800';
  const iconColor = type === 'error' ? 'text-red-400' : 'text-blue-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${bgColor} border ${borderColor} rounded-lg shadow-lg`}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0">
          {type === 'error' ? (
            <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <div className="ml-3">
          <button
            onClick={onClose}
            className={`inline-flex rounded-md p-1.5 ${type === 'error' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'error' ? 'red' : 'blue'}-50 focus:ring-${type === 'error' ? 'red' : 'blue'}-600 transition-colors`}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StockActionModal = ({ isOpen, onClose, stock, currentPrice }) => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Current price is already in INR from backend
  const currentPriceINR = currentPrice || 0;

  const [orderData, setOrderData] = useState({
    name: stock?.name || '',
    qty: 1,
    // Price is already in INR from backend
    price: currentPriceINR,
    mode: 'MARKET',
    symbol: stock?.symbol || '',
    limitPrice: currentPriceINR
  });

  // Update order data when currentPrice changes
  const updateOrderData = () => {
    if (currentPriceINR > 0) {
      setOrderData(prev => ({
        ...prev,
        price: currentPriceINR,
        limitPrice: currentPriceINR
      }));
    }
  };

  // Update when modal opens or currentPrice changes
  useState(() => {
    if (isOpen) {
      updateOrderData();
    }
  });

  // Total in INR
  const calculateTotal = () => {
    const priceToUse = orderData.mode === 'LIMIT' ? orderData.limitPrice : currentPriceINR;
    return (priceToUse * orderData.qty);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token")?.trim();

    if (!token) {
      showAlert('error', "You must be logged in to buy stocks!");
      setLoading(false);
      return;
    }

    const finalPrice = orderData.mode === 'LIMIT' ? orderData.limitPrice : currentPriceINR;
    const totalAmount = finalPrice * orderData.qty;

    console.log(` Order Details: 
      Stock: ${stock.symbol}
      Quantity: ${orderData.qty}
      Price per share: ₹${finalPrice.toFixed(2)}
      Total: ₹${totalAmount.toFixed(2)}
    `);

    // Prepare payload in INR
    const payload = {
      ...orderData,
      price: finalPrice,
      avgPrice: finalPrice,
      totalPrice: totalAmount
    };

    try {
      const response = await axios.post("https://flow-trade.onrender.com/dashboard/UserStock/buy", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Bought successfully:", response.data);
      showAlert('success', "Stock purchased successfully!");
      onClose(payload);
    } catch (err) {
      console.error(" Buy error:", err);
      const errorMessage = err.response?.data?.message || "Failed to buy stock. Please try again.";
      
      if (err.response?.status === 401) {
        showAlert('error', 'Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        showAlert('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 overflow-y-auto"
          >
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            />
            
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-xl origin-left"
                />
                
                <div className="flex justify-between items-center mb-6 pt-2">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold text-gray-900"
                  >
                    Buy {stock?.symbol}
                  </motion.h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onClose(null)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                    disabled={loading}
                  >
                    <span className="text-2xl">&times;</span>
                  </motion.button>
                </div>

                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Name</label>
                    <input
                      type="text"
                      value={orderData.name}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <div className="flex rounded-lg shadow-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, qty: Math.max(1, prev.qty - 1) }))}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        -
                      </motion.button>
                      <input
                        type="number"
                        min="1"
                        value={orderData.qty}
                        onChange={(e) => setOrderData(prev => ({ ...prev, qty: Math.max(1, parseInt(e.target.value) || 1) }))}
                        disabled={loading}
                        className="flex-1 px-3 py-2 border-y border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-center"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, qty: prev.qty + 1 }))}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                    <select
                      value={orderData.mode}
                      onChange={(e) => setOrderData(prev => ({ ...prev, mode: e.target.value }))}
                      disabled={loading}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="MARKET">Market Order</option>
                      <option value="LIMIT">Limit Order</option>
                    </select>
                  </motion.div>

                  {orderData.mode === 'LIMIT' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price (INR)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={orderData.limitPrice}
                          onChange={(e) => setOrderData(prev => ({ 
                            ...prev, 
                            limitPrice: Math.max(0, parseFloat(e.target.value) || 0)
                          }))}
                          disabled={loading}
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Market Price (INR)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">₹</span>
                        <input
                          type="text"
                          value={formatINR(currentPriceINR).replace('₹', '')}
                          readOnly
                          className="block w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (INR)</label>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="block w-full px-3 py-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm font-semibold text-blue-700 text-center"
                    >
                      {formatINR(calculateTotal())}
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex justify-end space-x-3 mt-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onClose(null)}
                      disabled={loading}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        'Confirm Buy'
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StockActionModal;