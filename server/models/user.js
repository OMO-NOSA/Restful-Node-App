const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },

    username: {
        type: String,
        minlength: 1
    },

    email: {
        type: String,
        required: true,
        minlength: 6,
        unique: true,
        validate: {
            validator: validator.isEmail,
        },
        message: "{VALUE} is not a valid email",
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
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
    }, ],
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'name'])
}

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'tty111').toString();

    user.tokens.push({
        access,
        token
    });

    user.save().then(() => {
        return token;
    }).then((token) => {
        return token;
    })
};

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'tty111')
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}
const User = mongoose.model("User", UserSchema);




module.exports = (User)