const express = require('express');
const bodyParser = require('body-parser');



const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { mongoose } = require('./db/mongoose');
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    }, (e) => {
        console.log(e);
        res.status(400).send(e);
    });
});

app.listen(port, () =>
    console.log(`Server is listening at http://localhost:${port}`)
);
module.exports = { app };