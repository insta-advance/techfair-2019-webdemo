/**
* @module user/handler
*/

const { sendResponse, sendError } = require('../utils/response');
const HttpError = require('../utils/httpError');
// Controller
const User = require('./user');

const get = async (event, context, callback) => {
  try {
    const todos = await User.getAll();
    sendResponse(callback, 200, todos);
  } catch (e) {
    sendError(callback, e);
  }
};

const getSingle = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    if (id == null) {
      throw new HttpError('User ID is required.', 400);
    }

    const todos = await User.getSingle(id);
    if (!todos) {
      throw new HttpError('User not found.', 404);
    }

    sendResponse(callback, 200, todos);
  } catch (e) {
    sendError(callback, e);
  }
};

module.exports = {
  get,
  getSingle,
};
