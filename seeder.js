// Load Json into DB
// Need JSON file, DB connection, color library and Schema

const fs = require('fs');
const dotenv = require('dotenv');
const colors = require('colors');
const Theatre = require('./models/Theatre');
const Movies = require('./models/Movies');
const mongoose = require('mongoose');
const User = require('./models/User');


dotenv.config({ path: './config/config.env' });

/* Connecting to DB
=========================== */
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


/* Load JSON files
=========================== */
const theatres = JSON.parse(fs.readFileSync(`${__dirname}/_data/theatre.json`));
const movies = JSON.parse(fs.readFileSync(`${__dirname}/_data/movies.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`));

const importData = async () => {
    try {
        // await Theatre.create(theatres);
        // await Movies.create(movies);
        await User.create(users);
        console.log("Data loaded into DB".green.inverse);
    } catch (err) {
        console.log("Something went wrong".red, err)
    }
}

const deleteData = async () => {
    try {
        await Theatre.deleteMany();
        await Movies.deleteMany();
        await User.deleteMany();
        console.log("Data deleted into DB".red.inverse);
    } catch (err) {
        console.log("Something went wrong".red, err)
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}