import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmailVerification from "./components/EmailVerification";
import ResendVerification from "./components/ResendVerification";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import ErrorPage from "./components/ErrorPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Safely parse user data from localStorage
        const userData = localStorage.getItem("userData");
        if (userData && userData !== "undefined" && userData !== "null") {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Store user data in localStorage for persistence
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Clear all auth-related data from localStorage
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Error clearing localStorage on logout:", error);
    }
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Hero user={user} />} />
            <Route
              path="/dashboard/*"
              element={
                user ? (
                  <Dashboard user={user} />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Dashboard user={user} />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Dashboard user={user} />
                ) : (
                  <SignUp onSignupSuccess={handleSignupSuccess} />
                )
              }
            />
            <Route
              path="/resend-verification"
              element={<ResendVerification />}
            />
            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Catch-all route for undefined paths - MUST BE LAST */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;