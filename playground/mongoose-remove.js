const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');
const id = "5eb1884f0d6d569446a5b59a";


// Todo.remove({}).then((result) => {
//     console.log(result);
// });


Todo.findByIdAndRemove("5eb32cbd209a64d3b619c64f").then((todo) => {
    console.log(todo);
});