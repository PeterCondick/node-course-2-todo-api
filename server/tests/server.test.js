const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app}= require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
  _id: new ObjectID(),
  text: 'first'
}, {
  _id: new ObjectID(),
  text: 'second',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());

});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'qwe';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });

  });

  it('should not create a todo with empty data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });

  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    // make  sure get back a 404
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for invalid ids', (done) => {
    // make  sure get back a 404
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query db using findById - should not exist
        // expect(todo).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));

      });
  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if objectid invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    // grab id of first item
    // update text, set completed = true
    // 200
    // text changed, completed = true, completedAt = number
    var hexId = todos[0]._id.toHexString();

    var text = 'qweupd';
    var completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query db using findById - should exist
        // expect(todo).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          expect(todo.text).toExist().toEqual(text);
          expect(todo.completed).toExist().toEqual(completed);
          expect(todo.completedAt).toExist().toBeA('number');
          done();
        }).catch((e) => done(e));

      });
  });

  it('should clear completedAt when todo not completed', (done) => {
    // grab id of second item
    // update text, set completed = false
    // 200
    // text changed, completed = false, completedAt = null (toNotExist)
    var hexId = todos[1]._id.toHexString();

    var text = 'zzz';
    var completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query db using findById - should exist
        // expect(todo).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          expect(todo.text).toExist().toEqual(text);
          expect(todo.completed).toEqual(completed);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((e) => done(e));

      });
  });

});
