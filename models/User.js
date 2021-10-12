const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            'Please add a valid email'
        ],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    // Select : false will make this field hidden on sending response back to UI
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/* Password Encryption
=========================== */
UserSchema.pre('save', async function (req, res, next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

/* Creating JWT, sign function takes payload, secret, expire time

   Mongoose methid will be called be user instance of user schema 
=========================== */
UserSchema.methods.getJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

/* Match user entered and DB password
=========================== */
UserSchema.methods.matchPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

/* Create crypto token, hash it and send back
=========================== */
UserSchema.methods.getResetPasswordToken = function () {

    // Generate crypto token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Reset token expire time
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);