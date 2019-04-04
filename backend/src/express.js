const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const todosHandler = require('./todo/handler.express');
const usersHandler = require('./user/handler.express');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/users/:id/todos', todosHandler.getTodoByUserId);
app.post('/api/users/:id/todos', todosHandler.postTodo);
app.put('/api/users/:id/todos/:todoId', todosHandler.putTodo);
app.delete('/api/users/:id/todos/:todoId', todosHandler.deleteTodo);

app.get('/api/users/:id', usersHandler.getSingle);
app.get('/api/users', usersHandler.get);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log('Express app listening on port ' + port);
})




