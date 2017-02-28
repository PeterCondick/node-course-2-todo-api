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

  // db.collection('Todos').find().count().then((count) => {
  //     console.log(`Todos count ${count}`);
  //
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });

    // db.collection('Todos').find({
    //     _id: new ObjectID('58b5f8087aaf7a02670e4c47')
    //   }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    //   }, (err) => {
    //     console.log('Unable to fetch todos', err);
    //   });
  db.collection('Users').find({name: 'Mr Hairy'}).toArray().then((docs) => {
      console.log('Users Mr Hairy');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch todos', err);
    });
  //db.close();


});
