const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a review title'],
        maxlength: 100,
        trim: true
    },
    text: {
        type: String,
        required: [true, 'Please add a text for the review'],
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 to 10'],
        min: 1,
        max: 10
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
        default: Date.now,
    },
});

// Prevent user to add only one review per theatre
ReviewSchema.index({ theatre: 1, user: 1 }, { unique: true });

// Static Method to get Average Rating
ReviewSchema.statics.getAverageRating = async function (bootCampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootCampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Theatre').findByIdAndUpdate(bootCampId, {
            averageRating: obj[0].averageRating
        })
    } catch (err) {
        console.log(err);
    }

};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.theatre);
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.theatre);
})

module.exports = mongoose.model('Review', ReviewSchema);