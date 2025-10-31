import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3002/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        // Save token in localStorage
        localStorage.setItem("token", res.data.token);

        // Call parent callback on success with user data
        if (onLoginSuccess) onLoginSuccess(res.data.user);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }

      // In the catch block of handleSubmit function in Login.jsx:
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";

      // Special handling for email verification
      if (err.response?.data?.message?.includes("verify your email")) {
        setError(
          <span>
            {err.response.data.message}.{" "}
            <button
              onClick={() =>
                navigate("/resend-verification", {
                  state: { email: formData.email },
                })
              }
              className="underline hover:text-blue-700 font-semibold"
            >
              Resend verification email
            </button>
          </span>
        );
      } else {
        setError(errorMessage);
      }
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

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
          Welcome Back
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-center mb-6"
        >
          Sign in to your Flow Trade account
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
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
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
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition duration-200"
            >
              Create account
            </Link>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
