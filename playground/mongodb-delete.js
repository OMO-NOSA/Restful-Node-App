const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndDelete({ text: 'Read Chapter Five' }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete todos', err)
    })

    db.close();
});


//deleteMany//deleteOne//findOneAndDelete