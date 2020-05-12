const validator = require('validator');
const mongoose = require('mongoose');
const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        minlength: 1,
    },

    username: {
        type: String,
        minlength: 1,
    },

    email: {
        type: String,
        required: true,
        minlength: 6,
        unique: true,
        validate: {
            validator: validator.isEmail,
        },
        message: '{VALUE} is not a valid email'
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },

        token: {
            type: String,
            required: true
        },
    }]
});




module.exports = (User)