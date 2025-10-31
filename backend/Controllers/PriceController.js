const axios = require("axios");
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;

// Cache for USD to INR rate
let usdToInrCache = {
  rate: 83.0,
  lastUpdated: 0
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Get USD to INR rate from ExchangeRate-API
async function getUsdToInrRate() {
  const now = Date.now();
  
  // Return cached rate if still valid
  if (usdToInrCache.lastUpdated && (now - usdToInrCache.lastUpdated) < CACHE_DURATION) {
    console.log(" Using cached USD to INR rate:", usdToInrCache.rate);
    return usdToInrCache.rate;
  }

  try {
    console.log("Fetching fresh USD to INR rate from ExchangeRate-API...");
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`,
      { timeout: 10000 }
    );
    
    if (response.data && response.data.conversion_rates && response.data.conversion_rates.INR) {
      const rate = response.data.conversion_rates.INR;
      usdToInrCache.rate = rate;
      usdToInrCache.lastUpdated = now;
      
      console.log(" USD to INR rate fetched successfully:", rate);
      return rate;
    } else {
      throw new Error('Invalid response from ExchangeRate-API');
    }
  } catch (error) {
    console.error(" Error fetching USD to INR rate:", error.message);
    
    // Return cached rate even if expired, or fallback
    if (usdToInrCache.rate) {
      console.log("Using expired cached rate due to API error");
      return usdToInrCache.rate;
    }
    
    return 83.0; // Fallback rate
  }
}

// Get stock price from Finnhub API (returns USD price)
async function getStockPriceFromFinnhub(symbol) {
  try {
    console.log(`Fetching ${symbol} price from Finnhub...`);
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { timeout: 10000 }
    );
    
    if (response.data && typeof response.data.c === 'number') {
      const priceUSD = response.data.c;
      console.log(`${symbol} price from Finnhub: $${priceUSD}`);
      return priceUSD;
    } else {
      throw new Error('Invalid response from Finnhub API');
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} price from Finnhub:`, error.message);
    return null;
  }
}

// Unified stock price function - returns both USD and INR prices
async function getUnifiedStockPrice(symbol) {
  try {
    // Get USD price from Finnhub
    const priceUSD = await getStockPriceFromFinnhub(symbol);
    
    if (priceUSD === null || priceUSD === undefined) {
      throw new Error(`Failed to get USD price for ${symbol}`);
    }

    // Get exchange rate
    const exchangeRate = await getUsdToInrRate();
    
    // Convert to INR
    const priceINR = priceUSD * exchangeRate;
    
    console.log(` ${symbol}: $${priceUSD.toFixed(2)} USD × ${exchangeRate.toFixed(2)} = ₹${priceINR.toFixed(2)} INR`);
    
    return {
      symbol: symbol.toUpperCase(),
      priceUSD: parseFloat(priceUSD.toFixed(2)),
      priceINR: parseFloat(priceINR.toFixed(2)),
      exchangeRate: parseFloat(exchangeRate.toFixed(2)),
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error getting unified price for ${symbol}:`, error.message);
    return null;
  }
}

//  Get single stock price - Route handler
const getStockPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`Fetching price for: ${symbol}`);
    
    const priceData = await getUnifiedStockPrice(symbol.toUpperCase());
    
    if (!priceData) {
      return res.status(404).json({
        success: false,
        message: `Could not fetch price for ${symbol}`
      });
    }

    res.json({
      success: true,
      symbol: priceData.symbol,
      priceUSD: priceData.priceUSD,
      priceINR: priceData.priceINR,
      exchangeRate: priceData.exchangeRate,
      timestamp: priceData.timestamp
    });

  } catch (error) {
    console.error(' Error in getStockPrice:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock price',
      error: error.message
    });
  }
};

//  Get multiple stock prices - Route handler
const getMultipleStockPrices = async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symbols array is required'
      });
    }

    console.log(`Fetching prices for ${symbols.length} symbols:`, symbols);
    
    const prices = {};
    const uniqueSymbols = [...new Set(symbols.map(s => s.toUpperCase()))];

    for (const symbol of uniqueSymbols) {
      try {
        const priceData = await getUnifiedStockPrice(symbol);
        
        if (priceData) {
          prices[symbol] = {
            priceUSD: priceData.priceUSD,
            priceINR: priceData.priceINR,
            exchangeRate: priceData.exchangeRate,
            timestamp: priceData.timestamp
          };
          console.log(`${symbol}: $${priceData.priceUSD} → ₹${priceData.priceINR}`);
        } else {
          prices[symbol] = null;
          console.log(`${symbol}: Failed to fetch price`);
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        prices[symbol] = null;
      }
      
      // Rate limiting between API calls (500ms delay)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successfulCount = Object.values(prices).filter(p => p !== null).length;
    
    res.json({
      success: true,
      prices,
      message: `Fetched prices for ${successfulCount}/${uniqueSymbols.length} symbols`
    });

  } catch (error) {
    console.error(' Error in getMultipleStockPrices:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock prices',
      error: error.message
    });
  }
};

// 🔹 Get exchange rate - Route handler
const getExchangeRate = async (req, res) => {
  try {
    const exchangeRate = await getUsdToInrRate();
    
    res.json({
      success: true,
      exchangeRate: parseFloat(exchangeRate.toFixed(2)),
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error in getExchangeRate:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exchange rate',
      error: error.message
    });
  }
};

// 🔹 Get cached USD to INR rate (for poller)
const getCachedUsdToInrRate = async () => {
  return await getUsdToInrRate();
};

// 🔹 Get current stock price in INR (for poller)
const getCurrentStockPrice = async (symbol) => {
  const priceData = await getUnifiedStockPrice(symbol);
  return priceData ? priceData.priceINR : null;
};

// Export all functions
module.exports = {
  // Route handlers
  getStockPrice,
  getMultipleStockPrices,
  getExchangeRate,
  
  // Utility functions for poller
  getUsdToInrRate,
  getStockPriceFromFinnhub,
  getUnifiedStockPrice,
  getCachedUsdToInrRate,
  getCurrentStockPrice
};