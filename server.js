const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);
const dbConnection = require('./config/database');
// Connect to MongoDB
dbConnection();

// middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
const categoryRoute = require('./routes/categoryRoute');
app.use('/api/categories', categoryRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});