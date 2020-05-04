const mongoose = require('mongoose');
const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        minlength: 1,
    },

    username: {
        type: String,
        required: true,
        minlength: 1,
    },

    email: {
        type: String,
        required: true,
        minlength: 6,
    },
});




module.exports = (User)