//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// es6 object destructoring syntax
// var user = {name: 'foo', age: 32};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to DB');
  };
  console.log('Connected to MongoDb successfully');

  // Todos
  // find one and update
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58b60e53008c8e9f6c0248ee')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // Users
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58b5fb50d3d478026eab634a')
  }, {
    $set: {
      name: 'foo'
    },
    $inc: {
      age: 7
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //db.close();


});
