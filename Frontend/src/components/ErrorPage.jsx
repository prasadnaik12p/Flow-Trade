// src/components/ErrorPage/ErrorPage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Illustration */}
        <div className="text-8xl mb-6 animate-bounce">🔍</div>
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Current Path (for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Attempted to access:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
              {location.pathname}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button 
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Go Home
          </button>
          
          <button 
            onClick={handleGoBack}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Support Information */}
        <div className="text-gray-500 text-sm">
          <p>
            If you believe this is an error,{' '}
            <a 
              href="/support" 
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;