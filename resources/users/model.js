var users = require('./../../data/users.json');

/**
 * Check credentials.
 *
 * @param {Object} credentials - Credentials object with properties `email` and `password`.
 * @param {String} credentials.email - Email address.
 * @param {String} credentials.password - Password.
 * @returns {Object|Boolean} - User object or `false` when authentication failed.
 */
exports.checkCredentials = function (credentials) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == credentials.email) {
            if (users[i].password == credentials.password) {
                return users[i];
            }
        }
    }
    return false;
};