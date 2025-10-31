require('dotenv').config();

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: "No token provided",
      requiresAuth: true,
      redirectTo: "/login",
      requestedUrl: req.originalUrl // Send back the URL that was requested
    });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ 
      error: "Token missing",
      requiresAuth: true,
      redirectTo: "/login",
      requestedUrl: req.originalUrl
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Attach current user to request
    req.currentUser = decoded; 

    next();
  } catch (err) {
    return res.status(403).json({ 
      error: "Invalid or expired token",
      requiresAuth: true,
      redirectTo: "/login",
      requestedUrl: req.originalUrl
    });
  }
}

module.exports = authMiddleware;
