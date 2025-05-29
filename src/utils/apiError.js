class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message ?? "Something went wrong";
    this.errors = errors ?? [];
    this.stack = Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
