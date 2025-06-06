// server/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();

// ✅ Updated CORS configuration
app.use(cors({
    origin: 'https://ai-todo-app-ir47.onrender.com',
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Expect 'Bearer <token>'

    if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;  // Now you can access req.user.userId in routes
        next();
    });
};

// Auth routes (login, register, etc.)
app.use('/api/auth', authRoutes);

// Protected task routes
app.use('/api/tasks', authenticateToken, taskRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the AI-Powered To-Do List Backend!');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;
