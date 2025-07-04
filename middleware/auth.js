const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = authMiddleware;