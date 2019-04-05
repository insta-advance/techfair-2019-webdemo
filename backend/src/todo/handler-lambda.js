/**
* @module todo/handler
*/

const { sendResponse, sendError } = require('../utils/response');

// Handler
const handler = require('./handler');

const getTodoByUserId = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    const todos = await handler.getTodosByUserId(id);
    sendResponse(callback, 200, todos);
  } catch (e) {
    sendError(callback, e);
  }
};

const postTodo = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    const { body } = event;
    const newTodo = await handler.postTodo(id, body);
    sendResponse(callback, 200, newTodo);
  } catch (e) {
    sendError(callback, e);
  }
};

const putTodo = async (event, context, callback) => {
  try {
    const { id, todoId } = event.pathParameters;
    const { body } = event;
    const updatedTodo = await handler.putTodo(id, todoId, body);
    sendResponse(callback, 200, updatedTodo);
  } catch (e) {
    sendError(callback, e);
  }
};

const deleteTodo = async (event, context, callback) => {
  try {
    const { id, todoId } = event.pathParameters;
    await handler.deleteTodo(id, todoId);
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
