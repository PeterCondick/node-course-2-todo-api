require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  //console.log(req.body);

  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/{id}
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(404).send();
  }

  // find by id
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(404).send();
  }


  // remove todo by id
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

  // findOneAndUpdate
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users
// use pick to get email and password
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save().then(() => {

    return user.generateAuthToken();
  }).then((token) => {

    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});
// app.post('/users/login', (req, response) => {
//   var body = _.pick(req.body, ['email', 'password']);
//
//   User.findByEmail(body.email).then((user) => {
//
//     if (user) {
//       console.log(`comparing ${body.password} with hashed value ${user.password}`);
//       console.log('user', user);
//       bcrypt.compare(body.password, user.password, (err, bcres) => {
//         if (bcres) {
//           // logged in
//           user.generateAuthToken().then((token) => {
//             response.header('x-auth', token).send(user);
//           });
//         } else {
//           // incorrect password
//           console.log('password ' + body.password + ' wrong');
//           response.status(401).send();
//         }
//       });
//     } else {
//       // incorrect email
//       console.log('email wrong');
//       response.status(401).send();
//     }
//   });
//
// });

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
