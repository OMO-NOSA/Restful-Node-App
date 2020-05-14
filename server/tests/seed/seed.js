const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/todo')

const todos = [{
        _id: new ObjectID(),
        text: "First thing first",
    },
    {
        _id: new ObjectID(),
        text: "Pray about things",
        completed: true,
        completedAt: 33
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


module.exports = {
    todos,
    populateTodos
};