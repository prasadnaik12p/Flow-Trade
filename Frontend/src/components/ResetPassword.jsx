import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(res.data.message || "Failed to reset password");
      }

    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.message || "Failed to reset password. The link may have expired.";
      setError(errorMessage);
      if (err.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950 pt-16">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            to="/forgot-password" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold block"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950 pt-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. Redirecting to login...
          </p>
          <Link 
            to="/login" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold block"
          >
            Go to Login Now
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950 pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Create your new password
        </p>
        
        {/* Simple error display without AnimatePresence */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition duration-200"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}