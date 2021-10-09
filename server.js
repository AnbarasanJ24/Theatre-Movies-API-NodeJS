const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();


/* Body Parser
=========================== */
app.use(express.json())


/* Config Variables
=========================== */
dotenv.config({ path: './config/config.env' });


/* Connecting to DB
=========================== */
connectDB();

/* Route Files
=========================== */
const theatres = require('./routes/theatres');
const movies = require('./routes/movies');


/* Dev Logging Middleware
=========================== */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/* Mounting Router
=========================== */
app.use('/api/v1/theatres', theatres);
app.use('/api/v1/movies', movies);


/* Error Middleware
=========================== */
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

/* To start server
=========================== */
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `.blue.bold))