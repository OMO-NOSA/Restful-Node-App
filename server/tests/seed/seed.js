const { ObjectID } = require('mongodb');
const jwt = require("jsonwebtoken");

const { Todo } = require('../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
        _id: userOneId,
        email: 'andrewG@example.com',
        name: 'Andrew G',
        password: 'uyuyuyu',
        tokens: [{
            accss: 'auth',
            token: jwt.sign({
                _id: userOneId,
                access: 'auth'
            }, 'tty111').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'andrewC@example.com',
        name: 'Andrew C',
        password: 'uyuyuyu'

    }
]

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

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};


module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};