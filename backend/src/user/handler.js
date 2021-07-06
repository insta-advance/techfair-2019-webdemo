/**
* @module user/handler
*/

const HttpError = require('../utils/httpError');
// Controller
const User = require('./user');

const get = () => User.getAll();

const getSingle = async (id) => {
  if (id == null) {
    throw new HttpError('User ID is required.', 400);
  }

  const user = await User.getSingle(id);
  if (!user) {
    throw new HttpError('User not found.', 404);
  }

  return user;
};

module.exports = {
  get,
  getSingle,
};
