import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee,
  Package,
  Clock,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  RefreshCw,
  Eye,
  Calendar,
  Users,
  Wallet,
  PieChart
} from 'lucide-react'

// Loading Animation Component
const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-[60vh] flex items-center justify-center bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 m-4 sm:m-6"
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
        Loading your portfolio...
      </motion.p>
    </div>
  </motion.div>
)

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, delay = 0 }) => (
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
              {change.value} ({change.percentage}%)
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
)

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-[60vh] flex items-center justify-center bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 m-4 sm:m-6 p-6"
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center max-w-sm w-full"
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          transition: { duration: 2, repeat: Infinity }
        }}
        className="mb-4"
      >
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
      </motion.div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Data</h3>
      <p className="text-gray-600 mb-4 text-sm">{error}</p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mx-auto text-sm"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </motion.button>
    </motion.div>
  </motion.div>
)

export default function Overview() {
  const [accountOverview, setAccountOverview] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")?.trim();
      
      if (!token) {
        setError('No authentication token found. Please login again.')
        setLoading(false)
        return
      }

      const [overviewRes, statsRes] = await Promise.all([
        axios.get('https://flow-trade.onrender.com/dashboard/Overview', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('https://flow-trade.onrender.com/dashboard/Overview/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])
      
      if (overviewRes.data.success && statsRes.data.success) {
        setAccountOverview(overviewRes.data.data)
        setDashboardStats(statsRes.data.data)
      } else {
        setError('Failed to load dashboard data from server')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication failed. Please login again.')
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.')
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the backend is running.')
      } else {
        setError('Failed to load dashboard data. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Format currency for display
  const formatINR = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0'
    
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  }

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0.00'
    return Math.abs(value).toFixed(2)
  }

  const formatTime = (date) => {
    if (!date) return '--:--'
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Safe data access with fallbacks
  const safeData = {
    portfolio: accountOverview?.portfolio || { currentValue: 0, unrealizedPL: 0, unrealizedPLPercentage: 0 },
    today: accountOverview?.today || { profitLoss: 0, profitLossPercentage: 0 },
    account: accountOverview?.account || { availableCash: 0, totalValue: 0, investedValue: 0 },
    pendingOrders: accountOverview?.pendingOrders || [],
    recentActivity: accountOverview?.recentActivity || [],
    portfolioAllocation: accountOverview?.portfolioAllocation || []
  }

  const safeStats = dashboardStats || {
    totalHoldings: 0,
    pendingOrders: 0,
    watchlistItems: 0,
    todayOrders: 0
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen p-4 sm:p-6 lg:p-8 sm:mt-15"
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Portfolio Overview</h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 mt-1 text-sm sm:text-base"
            >
              Welcome back! Here's your trading summary for today.
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchDashboardData}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm w-full sm:w-auto justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <StatsCard
            icon={TrendingUp}
            title="Portfolio Value"
            value={formatINR(safeData.portfolio.currentValue)}
            change={{
              positive: safeData.portfolio.unrealizedPL >= 0,
              value: formatINR(Math.abs(safeData.portfolio.unrealizedPL)),
              percentage: formatPercentage(safeData.portfolio.unrealizedPLPercentage)
            }}
            delay={0.1}
          />
          
          <StatsCard
            icon={Activity}
            title="Today's P&L"
            value={formatINR(safeData.today.profitLoss)}
            change={{
              positive: safeData.today.profitLoss >= 0,
              value: formatINR(Math.abs(safeData.today.profitLoss)),
              percentage: formatPercentage(safeData.today.profitLossPercentage)
            }}
            delay={0.15}
          />
          
          <StatsCard
            icon={Wallet}
            title="Available Cash"
            value={formatINR(safeData.account.availableCash)}
            delay={0.2}
          />
          
          <StatsCard
            icon={PieChart}
            title="Total Value"
            value={formatINR(safeData.account.totalValue)}
            delay={0.25}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Stats</h2>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: Package, value: safeStats.totalHoldings, label: 'Holdings', color: 'blue' },
                  { icon: Clock, value: safeStats.pendingOrders, label: 'Pending', color: 'yellow' },
                  { icon: Star, value: safeStats.watchlistItems, label: 'Watchlist', color: 'purple' },
                  { icon: Calendar, value: safeStats.todayOrders, label: "Today's", color: 'green' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600 mx-auto mb-1 sm:mb-2`} />
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-${stat.color}-600 text-xs sm:text-sm`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {safeData.recentActivity.length} activities
                  </span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-3">
                {safeData.recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                ) : (
                  safeData.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <motion.div 
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          className={`p-2 rounded-full flex-shrink-0 ${
                            activity.action === 'BUY' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'
                          } transition-colors`}
                        >
                          {activity.action === 'BUY' ? 
                            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> : 
                            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                          }
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{activity.symbol}</p>
                          <p className="text-gray-500 text-xs sm:text-sm capitalize truncate">
                            {activity.action} • {activity.type || 'Market'} • {activity.status || 'Completed'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{activity.quantity} shares</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{formatINR(activity.price)}</p>
                        <p className="text-gray-400 text-xs">{formatTime(activity.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Pending Orders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pending Orders</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    {safeData.pendingOrders.length} pending
                  </span>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <div className="space-y-3">
                {safeData.pendingOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No pending orders</p>
                  </div>
                ) : (
                  safeData.pendingOrders.map((order, index) => (
                    <motion.div
                      key={order.id || index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg group hover:bg-yellow-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.symbol}</p>
                        <p className="text-gray-500 text-xs sm:text-sm truncate">{order.name}</p>
                        <p className="text-yellow-600 text-xs sm:text-sm capitalize mt-1">
                          {order.action} {order.type} • Limit: {formatINR(order.limitPrice)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.quantity} shares</p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          {formatTime(order.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Portfolio Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Portfolio Allocation</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {safeData.portfolioAllocation.length} holdings
                  </span>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-3">
                {safeData.portfolioAllocation.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No holdings in portfolio</p>
                  </div>
                ) : (
                  <>
                    {safeData.portfolioAllocation.slice(0, 5).map((stock, index) => (
                      <motion.div
                        key={stock.symbol || index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between py-3 group border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <motion.div 
                            whileHover={{ scale: 1.3 }}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                              ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
                            }`} 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{stock.symbol}</p>
                            <p className="text-gray-500 text-xs sm:text-sm truncate">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {formatINR(stock.value)}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm">
                            {formatPercentage(stock.percentage)}% • {stock.quantity} shares
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {safeData.portfolioAllocation.length > 5 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center pt-3"
                      >
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          View all {safeData.portfolioAllocation.length} holdings →
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}