require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Needed to serve static files

const app = express();

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');
const sequelize = require('./config/db'); // Sequelize connection

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Or your frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

// ✅ Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// ✅ Handle React routing (for all other routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sync Sequelize models and start server
sequelize.sync().then(() => {
  console.log('PostgreSQL connected and models synced.');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Error connecting to the database:', err);
});