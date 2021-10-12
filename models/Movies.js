const mongoose = require('mongoose');

const MoviesSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    duration: String,
    genre: {
        type: [String],
        enum: [
            'Action',
            'Comedy',
            'Thriller',
            'Romance',
            'Horror'
        ]
    },
    theatre: {
        type: mongoose.Schema.ObjectId,
        ref: 'Theatre',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Movies', MoviesSchema)

