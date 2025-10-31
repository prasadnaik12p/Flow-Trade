import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Call parent logout callback
    onLogout?.();
    // Close mobile menu
    setIsOpen(false);
    // Redirect to home page
    navigate('/');
  };

const handleAccount = () => {
  navigate('/dashboard/account');
}

  const navLinkClasses = (path) => 
    `py-2 px-3 font-semibold transition duration-300 ${
      location.pathname === path 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-blue-500'
    }`;

  const mobileNavLinkClasses = (path) =>
    `py-3 px-4 font-medium transition duration-300 rounded-lg ${
      location.pathname === path
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 mr-2 text-blue-700"
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="url(#grad)" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 18c2-4 10-4 12 0M12 14c2-4 8-4 10 0"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="font-bold text-blue-800 text-xl tracking-tight">Flow Trade</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={navLinkClasses('/')}>
              Home
            </Link>
            <Link to="/about" className={navLinkClasses('/about')}>
              About
            </Link>
            <Link to="/dashboard" className={navLinkClasses('/dashboard')}>
              Dashboard
            </Link>
            
            {/* Conditional rendering based on user authentication */}
            {user ? (
              // Show user info and logout when logged in
              <div className="flex items-center space-x-4 ml-4">
                <button onClick={handleAccount}>
                    <div className="px-4 py-2 text-sm text-cyan-50 width-full rounded-lg bg-blue-500 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user ? user.name : "User"}</span>

                </div>
              </button>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Show login/signup when not logged in
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="py-2 px-4 bg-gradient-to-r from-stone-300 to-stone-400 hover:from-stone-400 hover:to-stone-500 text-gray-700 font-semibold rounded-lg transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-900 hover:from-cyan-600 hover:to-blue-950 text-white font-semibold rounded-lg transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="outline-none p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2 py-4 px-2 border-t border-gray-200">
            <Link
              to="/"
              className={mobileNavLinkClasses('/')}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={mobileNavLinkClasses('/about')}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/dashboard"
              className={mobileNavLinkClasses('/dashboard')}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            
            {/* Conditional mobile menu */}
            {user ? (
              // Mobile logout when logged in
                <div className="pt-2 border-t border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-600 width-full rounded-lg bg-gray-50 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                 <span>{user ? user.name : "User"}</span>

                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg transition duration-300 text-center"
                >
                  Logout
                </button>
                </div>
              ) : (
              // Mobile login/signup when not logged in
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="py-3 px-4 bg-gradient-to-r from-stone-300 to-stone-400 hover:from-stone-400 hover:to-stone-500 text-gray-700 font-semibold rounded-lg transition duration-300 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-900 hover:from-cyan-600 hover:to-blue-950 text-white font-semibold rounded-lg transition duration-300 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;