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
  // delete many
  // db.collection('Todos').deleteMany({text: 'eat'}).then((result) => {
  //   console.log(result);
  // });

  // delete one
  // db.collection('Todos').deleteOne({text: 'eat'}).then((result) => {
  //   console.log(result);
  // });

  // find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });


  // Users
  // delete many
  // db.collection('Users').deleteMany({name: 'Mr Hairy'}).then((result) => {
  //   console.log(result);
  // });

  // find one and delete
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('58b5f9316e4cf90268894364')
  }).then((result) => {
    console.log(result);
  });


  //db.close();


});
