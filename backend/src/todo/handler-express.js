/**
* @module todo/handler
*/

// Handler
const handler = require('./handler');

const getTodoByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todos = await handler.getTodosByUserId(id);
    res.json(todos);
  } catch (e) {
    next(e);
  }
};

const postTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const newTodo = await handler.postTodo(id, body);
    res.json(newTodo);
  } catch (e) {
    next(e);
  }
};

const putTodo = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    const { body } = req;
    const updatedTodo = await handler.putTodo(id, todoId, body);
    res.json(updatedTodo);
  } catch (e) {
    next(e);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    await handler.deleteTodo(id, todoId);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTodoByUserId,
  postTodo,
  putTodo,
  deleteTodo,
};
