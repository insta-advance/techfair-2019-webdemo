const db = require('../utils/dynamodb');

const getAll = async () => {
  const dbResult = await db.getAll({
    attributes: ['id', 'name'],
  });
  return dbResult;
};

const getSingle = async (userId) => {
  if (userId == null) {
    throw new Error('User ID is not defined.');
  }

  const dbResult = await db.getOne({
    key: userId,
  });
  if (!dbResult) {
    return null;
  }

  const user = {
    id: dbResult.id,
    name: dbResult.name,
    todo_count: dbResult.todos ? dbResult.todos.length : 0,
  };

  return user;
};

module.exports = {
  getAll,
  getSingle,
};
