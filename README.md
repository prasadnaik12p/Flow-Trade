# 💹 Flow-Trade

<p align="center">
  <b>A Full-Stack Virtual Stock Trading Platform that brings real-world trading experience to your browser.</b><br/>
  Built with the MERN Stack — <b>MongoDB, Express.js, React, and Node.js</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License"/>
</p>

<p align="center">
  <a href="#live-demo">View Demo</a>
  ·
  <a href="#installation">Installation</a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#contact">Contact</a>
</p>

---

## 🚀 Live Demo

🔗 **Website:** [https://flow-trade-hnm7.vercel.app/](https://flow-trade-hnm7.vercel.app/)

---

## 🧭 Overview

**Flow-Trade** is a full-stack stock trading simulator that lets users experience real-world market conditions in a virtual environment.  
It combines live market data, portfolio management, and trade tracking — making it ideal for learners and investors to practice trading strategies without financial risk.

---

## 🎯 Features

- 🔐 **User Authentication** — Register, log in, and manage your account securely
- 💹 **Live Stock Data** — Fetch and display real-time stock/market data
- 💼 **Virtual Portfolio** — Buy and sell stocks, track holdings, and manage positions
- 📊 **Analytics Dashboard** — Track performance, profits/losses, and portfolio insights
- 🕒 **Order History** — Detailed transaction logs for every trade
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile
- 🧩 **Modular Architecture** — Clean separation between frontend and backend
- 🚀 **Deployable Anywhere** — Easily deployable with Vercel and Render

---

## 🧰 Tech Stack

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### APIs & Services
- **Finnhub API** - Stock market data
- **Currency API** - Exchange rates

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## 📂 Project Structure

```
Flow-Trade/
│
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── middleware/     # Custom middleware
│   └── server.js       # Entry point
│
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Frontend utilities
│   │   ├── hooks/      # Custom React hooks
│   │   ├── context/    # React context
│   │   └── App.js      # Main App component
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- API keys for Finnhub and Currency API

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend folder:
   ```env
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   FINNHUB_API_KEY=your_finnhub_api_key
   CURRENCY_API_KEY=your_currency_api_key
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm run dev
   # or for production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend folder:
   ```env
   VITE_FINNHUB_API_KEY=your_finnhub_api_key
   VITE_CURRENCY_API_KEY=your_currency_api_key
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 🧪 Usage

1. **Registration & Login**
   - Navigate to the homepage and register a new account
   - Log in using your credentials

2. **Dashboard Overview**
   - View your virtual balance and portfolio summary
   - Access market data and analytics

3. **Stock Trading**
   - Search for stocks using the search functionality
   - Buy stocks to add them to your portfolio
   - Monitor real-time price changes

4. **Portfolio Management**
   - Track your holdings and current positions
   - View profit/loss calculations
   - Sell stocks to close positions

5. **Transaction History**
   - Review past transactions and trade history
   - Monitor your trading performance

---



## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render)
- Connect your GitHub repository
- Set environment variables
- Deploy automatically on push

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



---

## 📫 Contact

**Created by:** Prasad Naik  
**📧 Email:** [mdbprasad223@gmail.com](mailto:mdbprasad223@gmail.com)  
**💼 LinkedIn:** [Prasad Naik](www.linkedin.com/in/prasad-naik-b68b2b296)  
**🐙 GitHub:** [prasad-naik](https://github.com/prasadnaik12p)

---

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io/) for providing stock market data API
- [Vercel](https://vercel.com/) for frontend hosting
- [Render](https://render.com/) for backend hosting
- The React and Node.js communities

---

<div align="center">

### ⭐ Don't forget to star this repository if you find it helpful!

</div>
