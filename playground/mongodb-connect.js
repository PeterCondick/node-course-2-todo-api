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

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Mr Hairy',
  //   age: 123,
  //   location: 'somewhere'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user');
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });


  db.close();


});
