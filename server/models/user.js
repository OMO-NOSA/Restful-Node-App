const mongoose = require("../db/mongoose");
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

let user = new User({
        name: "Nosa Omorodion",
        username: "Nossy",
        email: "nossy@gmail.com",
    })
    .save()
    .then(
        (doc) => {
            console.log(JSON.stringify(doc, undefined, 2));
        },
        (e) => {
            console.log("Unable to save user", e);
        }
    );


module.exports = (User)