require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');
const sequelize = require('./config/db'); // Sequelize connection

app.use(cors({
  origin: 'https://ai-todo-app-ir47.onrender.com', // You may update this to match your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

// ✅ API Routes FIRST
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

// ✅ THEN Serve React static files
app.use(express.static(path.join(__dirname, 'build')));

// ✅ Catch-all to handle React routing (after all API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sync Sequelize and start server
sequelize.sync().then(() => {
  console.log('PostgreSQL connected and models synced.');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Error connecting to the database:', err);
});
