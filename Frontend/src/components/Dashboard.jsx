import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiShoppingCart, FiTrendingUp, FiUser, FiBriefcase, FiHeart, FiMenu, FiX, FiBarChart2, FiArrowLeft } from "react-icons/fi";
import { RiRobot2Line, RiStockLine } from "react-icons/ri";
import { useState, useEffect } from "react";

import Orders from "./Orders";
import Positions from "./Positions";
import Account from "./Account";
import Holdings from "./Holdings";
import Wishlist from "./Wishlist";
import Stocks from "./Stocks";
import AiSupport from "./AiSupport";
import Overview from "./Overview";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: FiHome },
  { to: "/dashboard/stocks", label: "Stocks", icon: RiStockLine },
  { to: "/dashboard/orders", label: "Orders", icon: FiShoppingCart },
  { to: "/dashboard/positions", label: "Positions", icon: FiTrendingUp },
  { to: "/dashboard/holdings", label: "Holdings", icon: FiBriefcase },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: FiHeart },
  { to: "/dashboard/account", label: "Account", icon: FiUser },
];

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -20,
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

// Dashboard Error Page Component
const DashboardErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          The dashboard page <code className="bg-gray-100 px-2 py-1 rounded text-sm">{location.pathname}</code> was not found.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FiArrowLeft className="text-sm" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.username || 'User';
      }
      return 'User';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return 'User';
    }
  });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Sidebar item animation
  const sidebarItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      x: 5,
      backgroundColor: "rgba(6, 182, 212, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const mobileMenuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3
      }
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3
      }
    }
  };

  // Check if current path is valid dashboard route
  const isValidDashboardRoute = () => {
    const validRoutes = [
      '/dashboard',
      '/dashboard/stocks',
      '/dashboard/orders',
      '/dashboard/positions',
      '/dashboard/holdings',
      '/dashboard/wishlist',
      '/dashboard/account'
    ];
    return validRoutes.includes(location.pathname);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        {/* Sidebar for desktop & mobile */}
        <motion.div 
          initial={isMobile ? { x: -300 } : { x: 0 }}
          animate={isMobile ? (isMobileMenuOpen ? "open" : "closed") : { x: 0 }}
          variants={mobileMenuVariants}
          className={`fixed md:relative inset-y-0 left-0 z-50 w-64 md:w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex-col p-4 sm:p-6 shadow-xl md:shadow-none overflow-y-auto`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden mb-6 pt-4">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-300 text-xl font-bold flex items-center gap-2"
            >
              <FiBarChart2 className="text-cyan-400" />
              Dashboard
            </motion.h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-cyan-200 hover:text-white transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Desktop Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-3 mb-8 mt-4 p-4 bg-blue-800 rounded-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl flex items-center justify-center">
              <FiBarChart2 className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Dashboard</h2>
              <p className="text-cyan-200 text-sm">Flow Trade</p>
            </div>
          </motion.div>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon }, index) => {
              const isActive = location.pathname === to;
              return (
                <motion.div
                  key={to}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={sidebarItemVariants}
                >
                  <Link
                    to={to}
                    className={`flex items-center gap-3 text-white text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-cyan-600 text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0"
                    >
                      {Icon && <Icon className="text-lg" />}
                    </motion.div>
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-cyan-300 rounded-full ml-auto"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Info Section - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-auto pt-6 border-t border-blue-700 hidden md:block"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-800">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">Welcome Back!</p>
                <p className="text-cyan-200 text-xs truncate">{user}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-sm border-b border-gray-200 md:hidden sticky top-0 z-30"
          >
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <FiMenu className="text-xl" />
              </button>
              
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-800">FlowTrade</h1>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-xs">U</span>
              </div>
            </div>
          </motion.div>

          {/* Mobile Quick Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border-b border-gray-200 md:hidden"
          >
            <div className="flex overflow-x-auto py-2 px-3 gap-1 hide-scrollbar">
              {navItems.slice(0, 4).map(({ to, label, icon: Icon }, index) => {
                const isActive = location.pathname === to;
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Link 
                      to={to}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[70px] transition-all duration-200 text-xs font-medium ${
                        isActive
                          ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {Icon && <Icon className="text-base" />}
                      <span className="truncate text-xs">{label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Second mobile nav row */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border-b border-gray-200 md:hidden"
          >
            <div className="flex overflow-x-auto py-2 px-3 gap-1 hide-scrollbar">
              {navItems.slice(4).map(({ to, label, icon: Icon }, index) => {
                const isActive = location.pathname === to;
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Link 
                      to={to}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[70px] transition-all duration-200 text-xs font-medium ${
                        isActive
                          ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {Icon && <Icon className="text-base" />}
                      <span className="truncate text-xs">{label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Page Content */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="h-full w-full"
              >
                
                {!isValidDashboardRoute() ? (
                  <DashboardErrorPage />
                ) : (
                  <Routes location={location}>
                    <Route index element={<Overview />} />
                    <Route path="stocks" element={<Stocks />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="positions" element={<Positions />} />
                    <Route path="account" element={<Account />} />
                    <Route path="holdings" element={<Holdings />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    {/* Catch all invalid nested dashboard routes */}
                    <Route path="*" element={<DashboardErrorPage />} />
                  </Routes>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;