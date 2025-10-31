import React, { useState } from "react";
import Founder from "../assets/Founder.jpg";
import {
  FaUsers,
  FaUserShield,
  FaClock,
  FaShieldAlt,
  FaChartLine,
  FaRegHandshake,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Flow Trade?",
      answer:
        "Flow Trade is a production-grade virtual trading platform built to replicate real market behavior. It enables users to learn, analyze, and execute simulated trades using virtual currency and live market feeds, emphasizing realistic trade execution and portfolio management.",
    },
    {
      question: "Is this a real trading platform?",
      answer:
        "No — Flow Trade is a simulation for educational and testing purposes. It uses virtual funds so users can practice strategies and experiment without financial risk, while mirroring many behaviors of real trading systems.",
    },
    {
      question: "What technologies power Flow Trade?",
      answer:
        "Flow Trade is built with the MERN stack: React (frontend), Node.js + Express (backend), and MongoDB (database). Tailwind CSS provides styling. The app includes JWT-based auth, secure password handling, and real-time update mechanisms.",
    },
    {
      question: "What features does the product offer?",
      answer:
        "Key features include secure user authentication, virtual portfolio management, buy/sell order execution, transaction history, watchlists, analytics dashboards, and real-time portfolio updates to simulate live market conditions.",
    },
    {
      question: "Can I view the source code?",
      answer:
        "Yes — the full source code and project documentation are available on GitHub. The repository contains frontend and backend code, API documentation, and setup instructions for running the app locally.",
    },
    {
      question: "How secure is the application?",
      answer:
        "Security practices include hashed passwords (bcrypt), JWT for session/auth flows, protected API endpoints, input validation, and recommended deployment practices. Sensitive credentials should be stored in environment variables for production.",
    },
    {
      question: "Who is the product for?",
      answer:
        "Flow Trade is ideal for students, novice traders, and developers who want a realistic environment to practice trading strategies or to study the architecture of a full-stack trading application.",
    },
    {
      question: "What was the biggest engineering challenge?",
      answer:
        "Maintaining consistent, real-time portfolio state across frontend components and backend processes — especially when simulating market updates and concurrent user actions — was the most complex part of the build.",
    },
  ];

  return (
    <div className="flex flex-col gap-16 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-950 text-white">
      {/* Hero Section */}
      <section className="relative text-center min-h-[40vh] flex flex-col justify-center items-center space-y-6 px-4 mt-10 shadow-2xl rounded-b-3xl p-6 sm:p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-300 via-blue-400 to-transparent"></div>
        <h1 className="drop-shadow-lg mt-10 text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-100 tracking-tight animate-pulse z-10">
          About <span className="text-cyan-300">Flow Trade</span>
        </h1>
        <p className="drop-shadow-md text-base sm:text-xl md:text-2xl font-semibold p-2 sm:p-4 max-w-2xl mx-auto z-10">
          A production-grade virtual trading platform demonstrating modern full-stack engineering and realistic market simulation for learning and testing trading strategies.
        </p>
      </section>

      {/* Story & Stats */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 px-2 sm:px-4 max-w-7xl mx-auto">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 p-3 sm:p-5 drop-shadow-lg">
            Project Overview
          </h2>

          <p className="text-stone-50 font-semibold px-3 sm:px-5 text-base sm:text-lg leading-relaxed">
            <span className="text-cyan-300 font-bold">Flow Trade</span> is a full-stack trading simulation designed and built as a deployable web application. It provides users a secure environment to practice trading with virtual funds while demonstrating a complete end-to-end architecture.
          </p>

          <p className="text-stone-50 font-semibold px-3 sm:px-5 text-base sm:text-lg leading-relaxed mt-2">
            Built with the <span className="text-cyan-300 font-bold">MERN stack</span>, Flow Trade showcases frontend responsiveness, scalable RESTful APIs, secure authentication flows, and systems for near-real-time data updates and portfolio analytics.
          </p>

          <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 p-2 mt-4">
            <div className="w-full space-y-2 bg-gradient-to-br from-blue-900 to-blue-950 p-4 sm:p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30 flex flex-col items-center">
              <FaUsers className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
              <h3 className="text-2xl sm:text-3xl font-bold text-cyan-200">10+</h3>
              <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Integrated Features</p>
            </div>
            <div className="w-full space-y-2 bg-gradient-to-br from-blue-900 to-blue-950 p-4 sm:p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30 flex flex-col items-center">
              <FaUserShield className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
              <h3 className="text-2xl sm:text-3xl font-bold text-cyan-200">Robust</h3>
              <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Security Practices</p>
            </div>
            <div className="w-full space-y-2 bg-gradient-to-br from-blue-900 to-blue-950 p-4 sm:p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30 flex flex-col items-center">
              <FaClock className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
              <h3 className="text-2xl sm:text-3xl font-bold text-cyan-200">24/7</h3>
              <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Simulation Availability</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center w-full bg-gradient-to-br from-cyan-500 to-blue-900 rounded-3xl shadow-2xl p-6 sm:p-10 mt-4 sm:mt-0 relative overflow-hidden min-h-[260px]">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white via-cyan-200 to-transparent"></div>
          <h2 className="text-5xl sm:text-7xl font-extrabold text-stone-100 drop-shadow-lg animate-bounce z-10">
            2025
          </h2>
          <h3 className="text-xl sm:text-2xl font-semibold text-cyan-100 mt-4 text-center z-10">
            Product Completed
          </h3>
          <div className="mt-6 flex flex-col items-center z-10">
            <span className="inline-block w-16 sm:w-24 h-1 bg-cyan-200 rounded-full mb-2 animate-pulse"></span>
            <span className="text-cyan-50 text-base sm:text-lg font-medium">Showcasing Full-Stack Excellence</span>
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="w-full bg-gradient-to-r from-blue-950 to-blue-800 flex flex-col items-center justify-center px-2 sm:px-6 py-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-lg">Technical Highlights</h2>
        <p className="text-base sm:text-lg text-gray-300 mt-3 sm:mt-5 text-center">Core technologies and design decisions behind Flow Trade</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mt-8 sm:mt-10 w-full max-w-6xl">
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaUsers className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">User Authentication</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">JWT auth, email verification, and secure password handling with bcrypt</p>
          </div>

          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaShieldAlt className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">Data Security</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Protected endpoints and secure environment configuration</p>
          </div>

          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaChartLine className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">Real-time Updates</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Live portfolio tracking and dynamic analytics</p>
          </div>

          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaRegHandshake className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">RESTful APIs</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Well-structured backend endpoints and clear API contracts</p>
          </div>

          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaLightbulb className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">Modern UI/UX</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Responsive components and intuitive user flows</p>
          </div>

          <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 border border-cyan-700/30">
            <FaClock className="text-cyan-400 text-3xl sm:text-4xl mb-2 drop-shadow" />
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200">Performance</h3>
            <p className="text-gray-300 font-medium text-center text-sm sm:text-base">Optimized rendering and efficient data fetching</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gradient-to-br from-blue-900 to-blue-950 py-16 px-4 sm:px-6 rounded-3xl shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-lg mb-4">
              Product FAQs
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Answers to common questions about Flow Trade's goals, architecture, and usage.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl shadow-lg border border-cyan-700/30 overflow-hidden transition-all duration-300 hover:border-cyan-500/50"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-lg font-semibold text-cyan-200 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-cyan-400 flex-shrink-0">
                    {openFaq === index ? <FaChevronUp className="w-5 h-5" /> : <FaChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                <div
                  id={`faq-panel-${index}`}
                  className={`px-6 pb-4 transition-all duration-300 ${openFaq === index ? "block" : "hidden"}`}
                >
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Explore the Codebase</h3>
              <p className="text-cyan-100 mb-6">
                The complete source code, setup guide, and technical documentation are available on GitHub.
              </p>
              <a
                href="https://github.com/prasadnaik12p/Flow-Trade" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-100 transition-colors duration-300 shadow-lg">
                  View on GitHub
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Card */}
      <section className="flex flex-col items-center w-full mt-10 mb-10 px-2 sm:px-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-cyan-200 m-3 sm:m-5">Project Developer</h2>
        <div className="flex flex-col p-5 md:flex-row w-full max-w-3xl md:max-w-5xl lg:h-[50vh] bg-gradient-to-br from-cyan-700 via-blue-800 to-blue-950 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex justify-center items-center p-6 md:p-8">
            <img
              src={Founder}
              alt="Prasad Naik"
              className="object-cover w-35 h-35 sm:w-60 sm:h-60 rounded-full border-4 border-cyan-400 shadow-lg"
            />
          </div>

          <div className="flex flex-col justify-center items-center md:items-start p-4 sm:p-6 md:p-8 flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-200 lg:text-4xl">Prasad Naik</h3>
            <h4 className="text-base sm:text-lg text-cyan-100 font-semibold mb-3 mt-1">Full-Stack Developer</h4>
            <p className="text-gray-300 text-center md:text-left text-sm sm:text-base lg:text-lg font-medium">
              Passionate about building scalable web applications with modern technologies. Flow Trade demonstrates expertise in full-stack architecture, security, and responsive design.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-full text-sm">Node.js</span>
              <span className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-full text-sm">MongoDB</span>
              <span className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-full text-sm">Express</span>
              <span className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
