var parse = require('co-body');
var jwt = require('jsonwebtoken');

var users = require('../users/model');
var config = require('../../config/auth');

/**
 * Authenticate a user.
 *
 * Returns a JWT when credentials are correct, or a status code of 403 when they are not.
 *
 * @returns {*} - Status code of 200 with token payload or 403 when login failed.
 */
exports.authenticate = function* () {
    var parsed = yield parse.json(this);

    var credentials = {
        email: parsed.email,
        password: parsed.password
    };

    var user = users.checkCredentials(credentials);

    if (!user) {
        this.status = 403;
        return;
    }

    var payload = {
        id: user.id
    };

    if (user.role) {
        payload.role = user.role;
    }

    this.body = { token: jwt.sign(payload, config.secret) };
};