const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp2';


mongoose.Promise = global.Promise;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },

    completed: {
        type: Boolean
    },

    completedAt: {
        type: Number
    }
});
let newTodo = new Todo({
    text: 'Call Michael',
    completed: false,
    completedAt: 1
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo');
});