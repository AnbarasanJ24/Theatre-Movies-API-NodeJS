const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');

const app = express();

/* Config Variables
=========================== */
dotenv.config({ path: './config/config.env' });


/* Connecting to DB
=========================== */
connectDB();

/* Route Files
=========================== */
const theatres = require('./routes/theatres');


/* Dev Logging Middleware
=========================== */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/* Mounting Router
=========================== */
app.use('/api/v1/theatres', theatres);


const PORT = process.env.PORT || 5000;

/* To start server
=========================== */
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `.blue.bold))