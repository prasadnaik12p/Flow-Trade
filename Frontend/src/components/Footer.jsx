function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 shadow-inner">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
                {/* Brand Section */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                    <a href="#" className="flex items-center py-4">
                        <svg
                            className="h-8 w-8 mr-2 text-cyan-400"
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
                        <span className="font-bold text-white text-xl tracking-tight">Flow Trade</span>
                    </a>
                    <p className="text-blue-200 text-sm leading-relaxed">
                        Advanced Virtual trading platform for modern investment learners. 
                        Trade with confidence and precision.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Platform</h3>
                    <a href="/dashboard" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Dashboard
                    </a>
                    <a href="/dashboard/stocks" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Stocks
                    </a>
                    <a href="/dashboard/positions" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Positions
                    </a>
                    <a href="/dashboard/holdings" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Holdings
                    </a>
                </div>

                {/* Legal Links */}
                <div className="flex flex-col items-center md:items-end space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Company</h3>
                    <a href="/about" className="text-blue-200 hover:text-white transition-colors text-sm">
                        About Us
                    </a>
                    <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Terms of Service
                    </a>
                    <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                        Security
                    </a>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-10 pt-6 border-t border-blue-600">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-blue-300 text-sm text-center md:text-left">
                            &copy; {new Date().getFullYear()} Flow Trade. All rights reserved.
                        </div>
                        <div className="text-blue-300 text-xs text-center md:text-right">
                            Built for traders, by traders
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;