const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');


//beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Do something';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo with invalid test data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));

            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
});


describe('GET /todos/:id', () => {
    it('should get a specific todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                console.log(res.body.todo.text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/234/')
            .expect(404)
            .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('Should delete an item by id', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {

                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    // it('should return 404 if object id is invalid', (done) => {

    // });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });
});
describe('PATCH /todos/:id', () => {
    it('should update the todo by id', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'Complete the format for report';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        let text = "Complete the format for report for lanre";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    })
});


describe('GET /users/me', () => {
    it('should return users if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
                expect(res.body.name).toBe(users[0].name);
            })
            .end(done);
    });

    it("should return users if authenticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});
describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'examp@email.com';
        let name = 'Examp Man';
        let password = 'Exam6666';

        request(app)
            .post('/users')
            .send({
                email,
                password,
                name
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email })
                    .then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it("should return validation errors if request is invalid", (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: 'tttt',
                name: ''
            })
            .expect(400)
            .end(done)
    });

    it("should not create user if email is in use", (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password45'
            })
            .expect(400)
            .end(done)
    });
});
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();

            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0].toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    }));
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should reject invalid login", (done) => {
        //let userId = new ObjectID().toHexString();
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password + 1,
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(userId)
                    .then((user) => {
                        expect(
                            user.tokens.length
                        ).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });


});