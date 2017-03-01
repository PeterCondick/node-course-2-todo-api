var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  //console.log(req.body);

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/{id}
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(404).send();
  }

  // find by id
  Todo.findById(id).then((todo) => {
    // success
    if (todo) {
      // if todo - return it
      return res.send({todo});
    }
    // no todo - 404 - empty
    res.status(404).send();

  // Error
  }).catch((e) => {
    // 400 - empty
    res.status(400).send();
  });

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
