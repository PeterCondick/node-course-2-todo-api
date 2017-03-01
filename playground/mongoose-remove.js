const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// removes all matching object
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// removes just one matching object
// Todo.findOneAndRemove({});

Todo.findOneAndRemove({
  id: '58b74dfb6745ad7802bc7413'
}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('58b74dfb6745ad7802bc7413').then((todo) => {
  console.log(todo);
});
