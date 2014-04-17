module.exports = AuthenticationError;

function AuthenticationError(message) {
    this.name = 'AuthenticationError';
    this.message = message || 'Authentication error';
}

AuthenticationError.prototype = new Error();
AuthenticationError.prototype.constructor = AuthenticationError;