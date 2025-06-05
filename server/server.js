require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');
const sequelize = require('./config/db'); // Import the Sequelize connection

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

// Sync Sequelize models with the database
sequelize.sync().then(() => {
  console.log('PostgreSQL connected and models synced.');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Error connecting to the database:', err);
});
