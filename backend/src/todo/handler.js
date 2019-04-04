/**
* @module todo/handler
*/

const HttpError = require('../utils/httpError');
// Controller
const Todo = require('./todo');

const getTodosByUserId = async (id) => {
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }

    const todos = await Todo.getAllByUser(id);
    if (!todos) {
      throw new HttpError('User not found.', 404);
    }

    return todos;
};

const postTodo = async (id, todo) => {
    let body;
    try {
      body = JSON.parse(todo);
    } catch (e) {
      throw new HttpError('Invalid request body', 400);
    }

    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }

    // Validate todo data
    if (
      body == null ||
      body.title == null ||
      body.description == null
    ) {
      throw new HttpError('Invalid format of Todo object.', 400);
    }

    const newTodo = await Todo.createUserTodo(id, body);
    if (!newTodo) {
      throw new HttpError('User not found.', 404);
    }

    return newTodo;
};

const putTodo = async (id, todoId, todo) => {
    let body;
    try {
      body = JSON.parse(todo);
    } catch (e) {
      throw new HttpError('Invalid request body', 400);
    }

    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }
    if (todoId == null) {
      throw new HttpError('Todo ID is required.', 400);
    }

    // Validate todo data
    if (
      body == null ||
      (
        body.title == null &&
        body.description == null &&
        body.isDone == null
      )
    ) {
      throw new HttpError('Invalid format of Todo object.', 400);
    }

    const updatedTodo = await Todo.updateUserTodo(id, todoId, body);
    if (!updatedTodo) {
      throw new HttpError('User not found.', 404);
    }

    return updatedTodo;
};

const deleteTodo = async (id, todoId) => {
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }
    if (todoId == null) {
      throw new HttpError('Todo ID is required.', 400);
    }

    const deletedTodo = await Todo.deleteUserTodo(id, todoId);
    if (!deletedTodo) {
      throw new HttpError('User not found.', 404);
    }

    return deletedTodo;
};

module.exports = {
  getTodosByUserId,
  postTodo,
  putTodo,
  deleteTodo,
};