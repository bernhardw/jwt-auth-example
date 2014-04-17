module.exports = AuthorizationError;

function AuthorizationError(message) {
    this.name = 'AuthorizationError';
    this.message = message || 'Authorization error';
}

AuthorizationError.prototype = new Error();
AuthorizationError.prototype.constructor = AuthorizationError;