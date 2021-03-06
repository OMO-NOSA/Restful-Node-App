const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const path = require('path');

require('./config/config');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose');
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const swaggerUi = require('swagger-ui-express');
const { specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/swagger.json", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     tags:
 *       — Todo
 *     summary: This should create a new todo.
 *     description: This route creates a todo for a particular user
 *     consumes:
 *       — application/json
 *     parameters:
 *       — name: body
 *       in: body
 *       schema:
 *         type: object
 *         properties:
 *           text:
 *           type: string
 *     responses: 
 *       200:
 *         description: Receive back todos and todos IDs.
 */

app.post('/todos', authenticate,
    (req, res) => {
        const todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
    });
/**
 * @swagger
 * /api/puppies/{id}:
 *   get:
 *     tags:
 *       - Puppies
 *     description: Returns a single puppy
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Puppy's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single puppy
 *         schema:
 *           $ref: '#/definitions/Puppy'
 */

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(404).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: 'Id not Valid'
        })
    }
    Todo.findOne({
            _id: id,
            _creator: req.user._id
        })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.status(200).send({ todo });
        })
        .catch((e) => {
            res.status(400).send();
        });
});

app.patch('/todos/:id ', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "Id not Valid",
        });
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete("/todos/:id", authenticate, async(req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({
                message: "Id not Valid",
            });
        }

        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    } catch (error) {
        res.status(400).send();
    }
});

app.post("/users", async(req, res) => {

    try {
        const body = _.pick(req.body, ["name", "email", "password"]);
        const user = new User(body);
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (error) {
        res.status(400).send({
            message: "Token not generated",
            error,
        });
    }
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async(req, res) => {

    try {
        const body = _.pick(req.body, ["email", "password"]);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header("x-auth", token).send(user);
    } catch (error) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async(req, res) => {

    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }

});



app.listen(port, () =>
    console.log(`Server is listening at http://localhost:${port}`)
);
module.exports = { app };