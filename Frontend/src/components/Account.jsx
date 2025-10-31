import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  CreditCard, 
  History, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Shield,
  Zap
} from 'lucide-react'

// Stripe Payment Modal Component
const StripePaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(1000)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('amount')
  const [paymentError, setPaymentError] = useState('')
  const [paymentProcessed, setPaymentProcessed] = useState(false)

  const amountOptions = [
    { value: 1000, label: '₹1,000', description: 'Quick Start' },
    { value: 2500, label: '₹2,500', description: 'Basic Trading' },
    { value: 5000, label: '₹5,000', description: 'Standard Pack' },
    { value: 10000, label: '₹10,000', description: 'Pro Trading' },
    { value: 25000, label: '₹25,000', description: 'Premium' },
    { value: 50000, label: '₹50,000', description: 'Expert' }
  ]

  const handleQuickAdd = async (amount) => {
    if (paymentProcessed) {
      console.log('🛑 Payment already processed, skipping duplicate call')
      return
    }

    try {
      setLoading(true)
      setPaymentError('')
      setPaymentProcessed(true)
      const token = localStorage.getItem('token')
      
      console.log(`💰 Quick adding ₹${amount}...`)
      
      const response = await axios.post('http://localhost:3002/api/payments/quick-add', 
        { amount },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('✅ Quick add response:', response.data)

      if (response.data.success) {
        setStep('success')
        setTimeout(() => {
          onSuccess(amount)
          onClose()
          setStep('amount')
          setPaymentProcessed(false)
        }, 2000)
      } else {
        throw new Error(response.data.message || 'Payment failed')
      }
    } catch (error) {
      console.error('❌ Quick add error:', error)
      setPaymentProcessed(false)
      
      let errorMessage = 'Payment failed. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid amount or payment details.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setPaymentError(errorMessage)
      setStep('amount')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep('amount')
    setPaymentError('')
    setAmount(1000)
    setPaymentProcessed(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleAddFundsClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading || paymentProcessed) {
      console.log('🛑 Payment already in progress, ignoring click')
      return
    }

    console.log('🔄 Starting payment process...')
    await handleQuickAdd(amount)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4"
          >
            <div className="flex items-center">
              <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{paymentError}</span>
            </div>
          </motion.div>
        )}

        {step === 'amount' && (
          <>
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Add Virtual Funds</h3>
              <p className="text-gray-600 text-sm sm:text-base">Add money to your trading account</p>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {amountOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAmount(option.value)
                      setPaymentError('')
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                      amount === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">{option.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={amount}
                  onChange={(e) => {
                    const value = Math.max(100, Math.min(100000, Number(e.target.value)))
                    setAmount(value)
                    setPaymentError('')
                  }}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Min: ₹100 | Max: ₹1,00,000</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 mb-4">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-yellow-700 text-xs sm:text-sm">
                  <strong>Development Mode:</strong> Using quick add. No real payment required.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-2 sm:py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <motion.button
                type="button"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={handleAddFundsClick}
                disabled={loading || amount < 100 || amount > 100000 || paymentProcessed}
                className="flex-1 py-2 sm:py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                <span>
                  {loading ? 'Processing...' : `Add ₹${amount.toLocaleString()}`}
                </span>
              </motion.button>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>Secure payment processing</span>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-6 sm:py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3 sm:mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Processing Payment</h3>
            <p className="text-gray-600 text-sm sm:text-base">Please wait while we add funds to your account...</p>
            <p className="text-sm text-gray-500 mt-1 sm:mt-2">Amount: ₹{amount.toLocaleString()}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 sm:py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
            >
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Funds Added Successfully!</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">₹{amount.toLocaleString()} added to your account</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs sm:text-sm text-gray-500"
            >
              Redirecting...
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return { icon: ArrowDownRight, color: 'text-green-600', bg: 'bg-green-100' }
      case 'withdrawal':
        return { icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-100' }
      case 'trade_buy':
        return { icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'trade_sell':
        return { icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' }
      default:
        return { icon: History, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const { icon: Icon, color, bg } = getTransactionIcon(transaction.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${bg} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${color}`} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-0.5 sm:mb-1">
            <p className="font-semibold text-gray-900 text-xs sm:text-sm capitalize truncate">
              {transaction.type.replace('_', ' ')}
            </p>
            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm truncate">
            {transaction.description || `${transaction.type.replace('_', ' ')} transaction`}
          </p>
          {transaction.assetSymbol && (
            <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">
              {transaction.assetSymbol} • {transaction.quantity} shares
            </p>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
        <p className={`font-bold text-xs sm:text-sm ${
          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
        </p>
        <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">
          {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
        </p>
        <p className="text-gray-400 text-xs hidden sm:block">
          {new Date(transaction.createdAt).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </motion.div>
  )
}

// Quick Action Card Component
const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'blue' }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', hover: 'bg-blue-200', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', hover: 'bg-purple-200', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', hover: 'bg-green-200', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', hover: 'bg-orange-200', text: 'text-orange-600' }
  }

  const colorClass = colorClasses[color] || colorClasses.blue

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all text-left group w-full"
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg ${colorClass.bg} flex items-center justify-center mb-2 sm:mb-3 group-hover:${colorClass.hover} transition-colors`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colorClass.text}`} />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
    </motion.button>
  )
}

// Main Account Component
export default function Account() {
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [filter, setFilter] = useState('all')
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchAccountData()
  }, [activeTab])

  const fetchAccountData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to view account details')
        setLoading(false)
        return
      }

      console.log('🔍 Fetching account data...')

      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:3002/api/payments/balance', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('❌ Balance API error:', error)
          throw error
        }),
        axios.get('http://localhost:3002/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('❌ Transactions API error:', error)
          throw error
        })
      ])

      console.log('💰 Balance response:', balanceRes.data)
      console.log('📊 Transactions response:', transactionsRes.data)

      if (balanceRes.data.success) {
        setBalance(balanceRes.data)
      } else {
        throw new Error(balanceRes.data.error || 'Failed to fetch balance')
      }

      if (transactionsRes.data.success) {
        setTransactions(transactionsRes.data.transactions || [])
      } else {
        throw new Error(transactionsRes.data.error || 'Failed to fetch transactions')
      }

    } catch (error) {
      console.error('❌ Error fetching account data:', error)
      
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        
        if (error.response.status === 404) {
          setError('Transactions endpoint not found. Check if backend routes are properly set up.')
        } else if (error.response.status === 500) {
          setError('Server error: ' + (error.response.data?.error || 'Internal server error'))
        } else {
          setError(`API Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`)
        }
      } else if (error.request) {
        console.error('No response received:', error.request)
        setError('No response from server. Check if backend is running on port 3002.')
      } else {
        setError(error.message || 'Failed to load account data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async (amount) => {
    try {
      console.log(`🔄 Refreshing balance after adding ₹${amount}...`)
      await fetchAccountData()
    } catch (error) {
      console.error('Error refreshing balance:', error)
    }
  }

  const exportToCSV = async () => {
    try {
      setExportLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to export data')
        return
      }

      console.log('📤 Exporting transactions to CSV...')

      const response = await axios.get('http://localhost:3002/api/transactions/export/csv', {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const date = new Date().toISOString().split('T')[0]
      link.download = `transactions-${date}.csv`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ CSV export completed')

    } catch (error) {
      console.error('❌ CSV export error:', error)
      
      if (error.response?.status === 404) {
        alert('Export feature not available yet. Please check back later.')
      } else if (error.response?.status === 500) {
        alert('Server error during export. Please try again later.')
      } else {
        alert('Failed to export transactions. Please try again.')
      }
    } finally {
      setExportLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const formatINR = (amount) => {
    if (!amount) return '₹0'
    return `₹${amount.toLocaleString('en-IN')}`
  }

  // Loading Component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3 sm:mb-4"
        />
        <p className="text-gray-600 text-sm sm:text-base">Loading account details...</p>
      </div>
    </div>
  )

  // Error Component
  const ErrorDisplay = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Unable to Load</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{error}</p>
        <button
          onClick={fetchAccountData}
          className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-gray-50/30 p-3 sm:p-4 lg:p-6 sm:mt-15"
    >
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Account & Payments</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-0.5 sm:mt-1">Manage your virtual funds and transactions</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchAccountData}
            className="bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Refresh</span>
          </motion.button>
        </motion.div>

        {/* Balance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-blue-100 text-xs sm:text-sm mb-1 sm:mb-2">Available Balance</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                {formatINR(balance?.virtualBalance)}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-blue-100">
                <span>Total Deposited: {formatINR(balance?.totalDeposited)}</span>
                <span className="hidden sm:inline">•</span>
                <span>Total Withdrawn: {formatINR(balance?.totalWithdrawn)}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPaymentModal(true)}
              className="mt-3 sm:mt-0 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add Funds</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <QuickActionCard
            icon={Plus}
            title="Add Funds"
            description="Add virtual money to your account"
            onClick={() => setShowPaymentModal(true)}
            color="blue"
          />
          <QuickActionCard
            icon={History}
            title="Transaction History"
            description="View all your transactions"
            onClick={() => setActiveTab('transactions')}
            color="purple"
          />
          <QuickActionCard
            icon={Download}
            title="Export Data"
            description="Download transaction reports"
            onClick={exportToCSV}
            color="green"
          />
          <QuickActionCard
            icon={Shield}
            title="Security"
            description="Manage account security"
            onClick={() => alert('Security settings coming soon!')}
            color="orange"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg sm:rounded-xl border border-gray-200"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: Eye },
                { id: 'transactions', name: 'Transactions', icon: History },
                { id: 'reports', name: 'Reports', icon: Download }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Current Balance</h3>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatINR(balance?.virtualBalance)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <ArrowDownRight className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Total Deposited</h3>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatINR(balance?.totalDeposited)}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Total Transactions</h3>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {transactions.length}
                    </p>
                  </div>
                </div>

                {/* Recent Transactions Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {transactions.slice(0, 3).map((transaction, index) => (
                      <TransactionItem key={transaction._id || index} transaction={transaction} />
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        <History className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                        <p className="text-sm sm:text-base">No transactions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
                    {['all', 'deposit', 'withdrawal', 'trade_buy', 'trade_sell'].map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium capitalize whitespace-nowrap ${
                          filter === filterType
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filterType.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportToCSV}
                      disabled={exportLoading || transactions.length === 0}
                      className="flex items-center space-x-1 sm:space-x-2 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium bg-green-50 hover:bg-green-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exportLoading ? (
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span>{exportLoading ? 'Exporting...' : 'Export CSV'}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-2 sm:space-y-3">
                  <AnimatePresence>
                    {filteredTransactions.map((transaction, index) => (
                      <TransactionItem 
                        key={transaction._id || index} 
                        transaction={transaction} 
                      />
                    ))}
                  </AnimatePresence>

                  {filteredTransactions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-12"
                    >
                      <History className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No transactions found</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                        {filter === 'all' 
                          ? "You haven't made any transactions yet." 
                          : `No ${filter.replace('_', ' ')} transactions found.`
                        }
                      </p>
                      {filter !== 'all' && (
                        <button
                          onClick={() => setFilter('all')}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                        >
                          View all transactions
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Export Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Export Transactions</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">Download your transaction history</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exportToCSV}
                      disabled={exportLoading || transactions.length === 0}
                      className="w-full bg-green-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                    >
                      {exportLoading ? (
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span>{exportLoading ? 'Generating Report...' : 'Download CSV Report'}</span>
                    </motion.button>
                    <p className="text-gray-500 text-xs mt-2 sm:mt-3 text-center">
                      {transactions.length} transactions available for export
                    </p>
                  </motion.div>

                  {/* Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Transaction Statistics</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">View detailed analytics</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Total Transactions:</span>
                        <span className="font-semibold">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Deposits:</span>
                        <span className="font-semibold text-green-600">
                          {transactions.filter(t => t.type === 'deposit').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Trades:</span>
                        <span className="font-semibold text-blue-600">
                          {transactions.filter(t => t.type.includes('trade')).length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <StripePaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handleAddFunds}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}