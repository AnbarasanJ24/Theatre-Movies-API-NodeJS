const express = require('express');
const dotenv = require('dotenv');

const app = express();

// Config Variables
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;


// To start server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `))