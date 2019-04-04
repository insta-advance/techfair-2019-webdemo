const db = require('../utils/dynamodb');

const getAllByUser = async (userId) => {
  if (userId == null) {
    throw new Error('User ID is not defined.');
  }

  const dbResult = await db.getOne({
    key: userId,
  });
  if (!dbResult) {
    return null;
  }

  const todos = dbResult.todos ? dbResult.todos : [];

  return todos;
};

const createUserTodo = async (userId, todo) => {
  if (userId == null) {
    throw new Error('User ID is not defined.');
  }
  if (todo == null) {
    throw new Error('Todo data are not defined.');
  }

  const userDbResult = await db.getOne({
    key: userId,
  });
  if (!userDbResult) {
    return null;
  }

  const newTodoId = `todo${Date.now()}`;
  const newTodo = {
    id: newTodoId,
    ...todo,
    isDone: false,
  };

  const dbResult = await db.addListItem({
    key: userId,
    listName: 'todos',
    listItem: newTodo,
  });
  if (!dbResult) {
    return null;
  }

  return newTodo;
};

const updateUserTodo = async (userId, todoId, updatedTodo) => {
  if (userId == null) {
    throw new Error('User ID is not defined.');
  }
  if (todoId == null) {
    throw new Error('Todo ID is not defined.');
  }
  if (updatedTodo == null) {
    throw new Error('Todo data are not defined.');
  }

  const editTodo = {
    id: todoId,
    ...updatedTodo,
  };

  const dbResult = await db.updateListItem({
    key: userId,
    listName: 'todos',
    listItem: editTodo,
  });
  if (!dbResult) {
    return null;
  }

  return dbResult;
};

const deleteUserTodo = async (userId, todoId) => {
  if (userId == null) {
    throw new Error('User ID is not defined.');
  }
  if (todoId == null) {
    throw new Error('Todo ID is not defined.');
  }

  const delTodo = {
    id: todoId,
  };

  const dbResult = await db.deleteListItem({
    key: userId,
    listName: 'todos',
    listItem: delTodo,
  });
  if (!dbResult) {
    return null;
  }

  return true;
};


module.exports = {
  getAllByUser,
  createUserTodo,
  updateUserTodo,
  deleteUserTodo,
};
