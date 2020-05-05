const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');
const id = "5eb1884f0d6d569446a5b59a";

if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

Todo.find({
    _id: id

}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id

}).then((todos) => {
    console.log('Todos', todos);
});
Todo.findById(id).then((todo) => {
    console.log('Todo by Id', todo)
}).catch((e) => console.log(e));