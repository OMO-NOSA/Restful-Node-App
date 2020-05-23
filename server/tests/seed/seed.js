const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');

const { Todo } = require('../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
        _id: userOneId,
        email: "Nossy@example.com",
        name: "Nossy C",
        password: "uyuY2uyuj",
        tokens: [{
            access: "auth",
            token: jwt.sign({
                    _id: userOneId,
                    access: "auth",
                },
                process.env.JWT_SECRET).toString()
        }, ],
    },
    {
        _id: userTwoId,
        email: "andrewC@example.com",
        name: "AndrewC",
        password: "uyuY2uyuj",
        tokens: [{
            access: "auth",
            token: jwt.sign({
                    _id: userTwoId,
                    access: "auth",
                },
                process.env.JWT_SECRET).toString()
        }, ],
    },
];

const todos = [{
        _id: new ObjectID(),
        text: "First thing first",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: "Pray about things",
        completed: true,
        completedAt: 33,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[1]).save();
        let userTwo = new User(users[0]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done()).catch((e) => done(e));
};


module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};