const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { todos, populateTodos } = require('./seed/seed');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');



beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Do something';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
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

            })
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