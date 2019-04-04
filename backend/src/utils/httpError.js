/**
 * @module utils/httpError
 */

/** Class representing an HTTP error. */
class HttpError extends Error {
  /**
   * Create the HttpError.
   * @param {string} [message] - The error message.
   * @param {number} [status] - The http status code.
   */
  constructor(message, status = 500) {
    super();
    this.name = 'HttpError';
    this.status = status;
    this.type = HttpError.getErrorType(status);
    this.message = HttpError.getErrorMessage(message);
    this.stack = (new Error()).stack;
  }

  static getErrorType(status) {
    const types = {
      400: 'ValidationError',
      401: 'Unauthorized',
      403: 'Unauthorized',
      404: 'ResourceNotFound',
      500: 'ServerError',
    };
    return types[status] ? types[status] : types[500];
  }

  static getDefaultMessage(status) {
    const defaultMessages = {
      400: 'The request is not formatted correctly or is missing required attributes',
      401: 'Unauthorized',
      403: 'You are not authorized to access this resource',
      404: 'The requested resource was not found',
      500: 'Oops. Something went wrong. Please try again later.',
    };
    return defaultMessages[status] ? defaultMessages[status] : defaultMessages[500];
  }

  static getErrorMessage(message) {
    return message || HttpError.getDefaultMessage(this.status);
  }
}

module.exports = HttpError;
