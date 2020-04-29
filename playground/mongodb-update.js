const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5ea97d0532a1335651c4e303")
    }, {
        $set: {
            completed: true,
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete todos', err)
    })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5ea8a46c3bb8a23b290aad43")
    }, {
        $set: {
            name: 'Judith Onofurho',
            location: 'Delta/Nigeria'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update users', err);
    })

    //db.close();
});


//deleteMany//deleteOne//findOneAndDelete