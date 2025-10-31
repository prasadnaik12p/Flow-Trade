import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3002/auth/signup", 
        formData, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        setSuccess(true);
        // Don't automatically login - wait for email verification
        setFormData({ username: "", email: "", password: "" });
      } else {
        setError(res.data.message || "Signup failed");
      }

    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{formData.email}</strong>. 
            Please check your email and click the link to verify your account before logging in.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            >
              Go to Login
            </button>
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
            >
              Back to Sign Up
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950 pt-16"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-center text-gray-800 mb-2"
        >
          Create Account
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-center mb-6"
        >
          Join Flow Trade today and start trading
        </motion.p>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
        </AnimatePresence>

        <motion.form 
          variants={containerVariants}
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              minLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </motion.form>

        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition duration-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}