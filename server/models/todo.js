const mongoose = require('../db/mongoose');
const Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },

    completedAt: {
        type: Number,
        default: null,
    },
});
let newTodo = new Todo({
    text: "Rework five years plan   ",
    completed: false,
});

newTodo.save().then(
    (doc) => {
        console.log("Saved todo", doc);
    },
    (e) => {
        console.log("Unable to save todo", e);
    }
);

let newTodo2 = new Todo({
        text: "Work on azure portal",
        completed: false,
    })
    .save()
    .then(
        (doc) => {
            console.log("Saved todo", doc);
        },
        (e) => {
            console.log("Unable to save todo", e);
        }
    );

module.exports = { todo }