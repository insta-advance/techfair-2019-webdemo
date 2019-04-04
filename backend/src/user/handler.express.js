/**
* @module user/handler
*/

// Handler
const handler = require('./handler');

const get = async (req, res, next) => {
  try {
    const users = await handler.get();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await handler.getSingle(id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  get,
  getSingle,
};
