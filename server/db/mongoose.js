const mongoose = require("mongoose");
const url = "mongodb://mongo:27017/TodoApp2";

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = { mongoose }