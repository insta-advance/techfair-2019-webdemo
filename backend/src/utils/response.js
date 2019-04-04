/**
 * Responses to the lambda request.
 * @module utils/response
 */
const HttpError = require('./httpError');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

/**
 * Sends a success response.
 * @param {Function} callback - The handler that returns the response to the caller.
 * @param {number} status - The response status code.
 * @param {Object} response - The response object returned to the caller.
 */
const sendResponse = (callback, status, response) => callback(null, {
  statusCode: status || 200,
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders,
  },
  body: JSON.stringify(response),
});

/**
 * Sends an error response.
 * @param {Function} callback - The handler that returns the response to the caller.
 * @param {Object} err - The Error object passed from the failing function.
 */
const sendError = (callback, err = {}) => {
  /** Log the error to CloudWatch before any further processing */
  console.error(
    `ERROR (${err.status || 'No status code available'}) ${err.message}`,
    (err.stack && err.stack.join)
      ? err.stack.join('/n')
      : err.stack
  );

  /** Convert any non-HttpError to a HttpError instance for further processing */
  if (err instanceof HttpError === false) {
    // eslint-disable-next-line no-param-reassign
    err = new HttpError(err.message, 500);
  }

  /** Hide the actual server failure from the user, serve a generic error 500 message */
  if (err.status === 500) {
    // eslint-disable-next-line no-param-reassign
    err.message = HttpError.getDefaultMessage(500);
  }

  const resp = {
    ...{
      statusCode: err.status,
      error: err.type,
      message: err.message,
    },
  };

  return callback(null, {
    statusCode: err.status,
    headers: corsHeaders,
    body: JSON.stringify(resp),
  });
};

module.exports = {
  sendResponse,
  sendError,
};
