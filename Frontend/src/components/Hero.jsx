import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SlGraph } from 'react-icons/sl';
import { FiShield } from "react-icons/fi";
import { FiHeadphones } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Hero() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null';
  };

  // Handle Start Trading button click
  const handleStartTrading = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  // Handle Sign Up button click
  const handleSignUp = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  // Handle existing user login
  const handleLogin = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Animation variants (same as before)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1 + 0.8,
        duration: 0.6,
        ease: "backOut"
      }
    }),
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15 + 0.5,
        duration: 0.7,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.03,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const testimonialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2 + 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full px-2 sm:px-4 py-8 sm:py-12 mt-6 sm:mt-10 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 shadow-xl overflow-hidden"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-[220px] flex flex-col items-center justify-center text-center p-4 sm:p-8 md:p-12 lg:p-20 mx-auto max-w-7xl"
        >
          <motion.h1
            variants={itemVariants}
            className="font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-amber-50 drop-shadow-2xl tracking-tight"
          >
            Advanced <motion.span 
              animate={{ 
                color: ['#22d3ee', '#67e8f9', '#22d3ee'],
                textShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                  '0 0 30px rgba(34, 211, 238, 0.8)',
                  '0 0 20px rgba(34, 211, 238, 0.5)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-cyan-400"
            >
              Virtual Trading
            </motion.span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="font-semibold mt-4 sm:mt-6 text-base sm:text-xl md:text-2xl lg:text-3xl font-sans text-amber-100 drop-shadow"
          >
            Master trading with our <span className="text-cyan-300">realistic simulation platform</span> using virtual funds and live market data
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center w-full max-w-lg mx-auto"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleStartTrading}
              className="bg-gradient-to-r from-cyan-500 to-blue-700 p-3 sm:p-4 font-bold rounded-2xl w-full sm:w-60 text-amber-50 shadow-lg hover:from-cyan-600 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoggedIn() ? 'Go to Dashboard' : 'Start Trading Now'}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaLongArrowAltRight className="text-2xl" />
              </motion.span>
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSignUp}
              className="bg-amber-50 p-3 sm:p-4 font-bold rounded-2xl w-full sm:w-60 text-blue-800 shadow-lg hover:bg-cyan-400 hover:text-white transition-all duration-200"
            >
              {isLoggedIn() ? 'Start Trading' : 'Sign Up Free'}
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full"
          >
            {[
              { value: '10,000+', label: 'Virtual Trades Executed' },
              { value: '500+', label: 'Active Learners' },
              { value: '₹0', label: 'Financial Risk' },
              { value: '24/7', label: 'Practice Availability' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="h-[100px] sm:h-[120px] md:h-[150px] bg-gradient-to-br from-blue-800 to-blue-900 rounded-3xl shadow-lg p-4 sm:p-5 flex flex-col justify-center items-center border border-cyan-500/20"
              >
                <motion.p
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-300"
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-200 font-semibold text-sm sm:text-base md:text-lg font-sans mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col items-center text-center p-4 sm:p-8 lg:p-14"
      >
        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-cyan-300 mb-4 sm:mb-6 drop-shadow-lg"
        >
          Why Choose FlowTrade?
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
          className="text-amber-100 text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          The perfect environment to learn, practice, and master trading strategies risk-free
        </motion.p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-2 sm:mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl"
        >
          {/* Card 1 */}
          <motion.div
            custom={0}
            variants={featureCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-blue-800 to-cyan-900 p-5 sm:p-8 rounded-2xl flex flex-col items-center gap-2 sm:gap-3 h-full shadow-xl border-4 border-cyan-400/30"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-1 sm:mb-2"
            >
              <SlGraph className='w-full h-full text-cyan-300'/>
            </motion.div>
            <h4 className="text-base sm:text-lg md:text-xl font-bold text-amber-50">Real Market Simulation</h4>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg">Experience realistic trading with live market data and virtual portfolio management.</p>
            <ul className="list-disc list-inside space-y-1 mt-1 sm:mt-2 text-start text-cyan-100 text-xs sm:text-sm md:text-base">
              {['Live market feeds', 'Portfolio analytics', 'Real-time execution', 'Virtual ₹10,000 start'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            custom={1}
            variants={featureCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-blue-800 to-cyan-900 p-5 sm:p-8 rounded-2xl flex flex-col items-center gap-2 sm:gap-3 h-full shadow-xl border-4 border-cyan-400/30"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-1 sm:mb-2"
            >
              <FiShield className='w-full h-full text-cyan-300'/>
            </motion.div>
            <h4 className="text-base sm:text-lg md:text-xl font-bold text-amber-50">Risk-Free Learning</h4>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg">Practice trading strategies without financial risk using virtual currency.</p>
            <ul className="list-disc list-inside space-y-1 mt-1 sm:mt-2 text-start text-cyan-100 text-xs sm:text-sm md:text-base">
              {['Zero financial risk', 'Learn from mistakes', 'Build confidence', 'Experiment freely'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            custom={2}
            variants={featureCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-blue-800 to-cyan-900 p-5 sm:p-8 rounded-2xl flex flex-col items-center gap-2 sm:gap-3 h-full shadow-xl border-4 border-cyan-400/30"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-1 sm:mb-2"
            >
              <FiHeadphones className='w-full h-full text-cyan-300'/>
            </motion.div>
            <h4 className="text-base sm:text-lg md:text-xl font-bold text-amber-50">Educational Resources</h4>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg">Access comprehensive learning materials and community support.</p>
            <ul className="list-disc list-inside space-y-1 mt-1 sm:mt-2 text-start text-cyan-100 text-xs sm:text-sm md:text-base">
              {['Trading tutorials', 'Strategy guides', 'Community forums', 'Progress tracking'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col items-center text-center p-4 sm:p-8 lg:p-14"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-cyan-300 mb-4 sm:mb-6 drop-shadow-lg"
        >
          What Our Users Say
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
          className="text-amber-100 text-base sm:text-xl md:text-2xl max-w-2xl mx-auto"
        >
          Join thousands of learners who have improved their trading skills with our platform
        </motion.p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl"
        >
          {[
            {
              img: "https://randomuser.me/api/portraits/men/32.jpg",
              alt: "Student A",
              text: '"The realistic simulation helped me understand market dynamics without risking real money. Perfect for beginners!"',
              name: "Alex, Finance Student"
            },
            {
              img: "https://randomuser.me/api/portraits/women/44.jpg",
              alt: "User B",
              text: '"I went from zero trading knowledge to confidently analyzing stocks in just a few weeks. The educational content is fantastic!"',
              name: "Sarah, Aspiring Trader"
            },
            {
              img: "https://randomuser.me/api/portraits/men/65.jpg",
              alt: "User C",
              text: '"As a developer, I appreciate the clean interface and realistic market simulation. Great for testing strategies risk-free!"',
              name: "Mike, Software Engineer"
            }
          ].map((t, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={testimonialVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-blue-800 to-cyan-900 p-5 sm:p-8 rounded-2xl flex flex-col items-center shadow-xl border border-cyan-400/20"
            >
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                src={t.img}
                alt={t.alt}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-cyan-400 shadow-lg mb-3 sm:mb-4 object-cover"
              />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                viewport={{ once: true }}
                className="text-gray-200 font-medium mb-3 sm:mb-4"
              >
                {t.text}
              </motion.p>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                viewport={{ once: true }}
                className="text-cyan-100 font-bold"
              >
                - {t.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-r from-cyan-700 to-blue-900 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-14"
      >
        <motion.h1
          variants={floatingAnimation}
          animate="animate"
          className="text-xl sm:text-2xl md:text-4xl font-bold text-center text-cyan-300"
        >
          Ready to Master Trading?
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="text-amber-100 text-base sm:text-xl md:text-2xl text-center max-w-2xl font-semibold mt-3 sm:mt-5"
        >
          Start your risk-free trading journey today with ₹10,000 in virtual funds!
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 w-full sm:max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignUp}
            className="bg-gradient-to-r from-cyan-500 to-blue-700 p-4 font-bold rounded-2xl sm:w-60 text-amber-50 shadow-lg hover:from-cyan-600 hover:to-blue-800 transition-all duration-200 w-full"
          >
            {isLoggedIn() ? 'Go to Dashboard' : 'Start Learning Free'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="sm:ms-5 bg-amber-50 w-30 p-4 font-bold rounded-2xl sm:w-60 text-blue-800 shadow-lg hover:bg-cyan-400 hover:text-white transition-all duration-200 w-full"
          >
            {isLoggedIn() ? 'Start Trading now' : 'Existing User Login'}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Hero;