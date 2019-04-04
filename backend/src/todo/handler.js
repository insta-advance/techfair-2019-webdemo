/**
* @module todo/handler
*/

const { sendResponse, sendError } = require('../utils/response');
const HttpError = require('../utils/httpError');
// Controller
const Todo = require('./todo');

const getTodoByUserId = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }

    const todos = await Todo.getAllByUser(id);
    if (!todos) {
      throw new HttpError('User not found.', 404);
    }

    sendResponse(callback, 200, todos);
  } catch (e) {
    sendError(callback, e);
  }
};

const postTodo = async (event, context, callback) => {
  try {
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      throw new HttpError('Invalid request body', 400);
    }

    const { id } = event.pathParameters;
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

    sendResponse(callback, 200, newTodo);
  } catch (e) {
    sendError(callback, e);
  }
};

const putTodo = async (event, context, callback) => {
  try {
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      throw new HttpError('Invalid request body', 400);
    }

    const { id, todoid } = event.pathParameters;
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }
    if (todoid == null) {
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

    const updatedTodo = await Todo.updateUserTodo(id, todoid, body);
    if (!updatedTodo) {
      throw new HttpError('User not found.', 404);
    }

    sendResponse(callback, 200, updatedTodo);
  } catch (e) {
    sendError(callback, e);
  }
};

const deleteTodo = async (event, context, callback) => {
  try {
    const { id, todoid } = event.pathParameters;
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }
    if (todoid == null) {
      throw new HttpError('Todo ID is required.', 400);
    }

    const updatedTodo = await Todo.deleteUserTodo(id, todoid);
    if (!updatedTodo) {
      throw new HttpError('User not found.', 404);
    }

    sendResponse(callback, 204);
  } catch (e) {
    sendError(callback, e);
  }
};

module.exports = {
  getTodoByUserId,
  postTodo,
  putTodo,
  deleteTodo,
};
