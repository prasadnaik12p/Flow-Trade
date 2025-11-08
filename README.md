<h1 align="center">💹 Flow-Trade</h1>

<p align="center">
  <b>A Full-Stack Virtual Stock Trading Platform that brings real-world trading experience to your browser.</b><br/>
  Built with the MERN Stack — <b>MongoDB, Express.js, React, and Node.js</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status"/>
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

- 🔐 **User Authentication** — Register, log in, and manage your account securely.  
- 💹 **Live Stock Data** — Fetch and display real-time stock/market data.  
- 💼 **Virtual Portfolio** — Buy and sell stocks, track holdings, and manage positions.  
- 📊 **Analytics Dashboard** — Track performance, profits/losses, and portfolio insights.  
- 🕒 **Order History** — Detailed transaction logs for every trade.  
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile.  
- 🧩 **Modular Architecture** — Clean separation between frontend and backend.  
- 🚀 **Deployable Anywhere** — Easily deployable with Vercel and Render.

---

## 🧰 Tech Stack  

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT (JSON Web Token), bcryptjs |
| **Market Data** | Stock Market API (Finhub Api) |
| **Deployment** | Vercel (Frontend) + Render (Backend) |
| **Utilities** |  Dotenv, ESLint, Prettier |

---

## 📂 Folder Structure  

Flow-Trade/
│
├── backend/
| |__ schemas/
| |
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── App.js
│
└── README.md

yaml
Copy code

---

## ⚙️ Installation & Setup  

### 🧩 Prerequisites  
- [Node.js](https://nodejs.org/en/) (v14 or higher)  
- [MongoDB](https://www.mongodb.com/atlas) (local or cloud)  
- Stock Market API Key (optional)  

---

### 🖥 Backend Setup  

```bash
cd backend
npm install
Create a .env file in the backend folder:

env
Copy code
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
STOCK_API_KEY=your_stock_api_key
PORT=5000
Run the server:

bash
Copy code
npm run dev
# or
npm start
💻 Frontend Setup
bash
Copy code
cd frontend
npm install
Create a .env file in the frontend folder :

env
VITE_FINNHUB_API_KEY=xxxxxx
VITE_CURRENCY_API_KEY=xxxxxx
VITE_API_URL=(backend Url)




Run the frontend:

bash
Copy code
npm start
🧪 Usage
Navigate to the homepage and register a new account.

Log in using your credentials — you’ll see your virtual balance and dashboard.

Search or browse for stocks and Buy to add them to your portfolio.

Track holdings, check your P&L (Profit & Loss), and review past transactions.

Use Sell to close positions and manage your portfolio dynamically.

📫 Contact

Created by: Prasad Naik

📧 Email: mdbprasad223@gmail.com

