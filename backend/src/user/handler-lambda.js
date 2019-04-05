/**
* @module user/handler
*/

const { sendResponse, sendError } = require('../utils/response');

// Handler
const handler = require('./handler');

const get = async (event, context, callback) => {
  try {
    const users = await handler.get();
    sendResponse(callback, 200, users);
  } catch (e) {
    sendError(callback, e);
  }
};

const getSingle = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    const user = await handler.getSingle(id);
    sendResponse(callback, 200, user);
  } catch (e) {
    sendError(callback, e);
  }
};

module.exports = {
  get,
  getSingle,
};
