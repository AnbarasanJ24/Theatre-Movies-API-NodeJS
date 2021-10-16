const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');


const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();


/* Body Parser
=========================== */
app.use(express.json());

/* Cookie Parser
=========================== */
app.use(cookieParser());



/* Mongoose Santize Parser (Restrict NoSQL Injection)
{
    "email": {"$gt":""},
    "password": "123456"
}
=========================== */
app.use(mongoSanitize());


/* Set security header using helmet
=========================== */
app.use(helmet());


/* Cross site scripting
=========================== */
app.use(xss())


/* Rate Limiting
=========================== */
const limiter = rateLimit({
    windowMs: 10 * 6 * 1000,
    max: 100
})
app.use(limiter);


/* Prevent HTTP Params Pollution
=========================== */
app.use(hpp());


/* Enable CORS
=========================== */
app.use(cors());



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
const auth = require('./routes/auth');
const user = require('./routes/user');
const reviews = require('./routes/reviews');


/* Dev Logging Middleware
=========================== */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/* File upload
=========================== */
app.use(fileUpload());



/* Set static folder
=========================== */
app.use(express.static(path.join(__dirname, 'public')));



/* Mounting Router
=========================== */
app.use('/api/v1/theatres', theatres);
app.use('/api/v1/movies', movies);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', reviews);


/* Error Middleware
=========================== */
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

/* To start server
=========================== */
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `.blue.bold))