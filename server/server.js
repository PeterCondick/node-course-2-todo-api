require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(404).send();
  }


  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // success
      // if no doc, send 404
      // if doc - send doc back 200
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (err) => {
    // Error
      // 400 with empty body
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
