const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const TheatreSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characaters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot exceed 500 characaters']

    },
    website: {
        type: String,
        match: [/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            'Please use a valid HTTP or HTTPS URL']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot exceed 20 characters']

    },
    email: {
        type: String,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // Using Address we can fetch Geo JSON POint (Latitude, Longitude)
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    languages: {
        type: [String],
        enum: [
            "English",
            "Tamil",
            "Hindi"
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});


/* Custom Slug Generation
=========================== */
TheatreSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
})

module.exports = mongoose.model('Theatre', TheatreSchema);