var AuthenticationError = require('../lib/errors/AuthenticationError');
var AuthorizationError = require('../lib/errors/AuthorizationError');

module.exports = auth;

/**
 * Auth middleware.
 *
 * Protect routes by requiring authentication (and proper authorization).
 * The global JWT middleware has already inspected and tried to verify the token and appropriately set this.user.
 * This means that we can expect one of two things from `this.user`:
 * a) undefined when there was no token or an invalid one.
 * b) object with `id` and optionally `role: 'admin'`.
 *
 * Possible options are:
 *
 *     auth(): allows access to all authenticated users.
 *     auth({ roles: ['admin'] }): only allows access to a role of admin.
 *     auth({ types: ['owner', 'editor'] }): only allow access as resource owner and editor.
 *
 * When specifying virtual roles (instead of hard-fact roles such as admin) there needs to be some way to define the
 * relationship. For example how exactly is the owner defined. Or what are editors. That probably needs to be some kind
 * of custom adapter to the auth middleware.
 *
 * Admin: this.user.role has 'admin'
 * Owner: this.resource.user is this.user.id
 * Editor: this.resource.editors has this.user.id
 *
 * Of course by then the resource would have to be attached to this.resource (ctx) already. Probably through an earlier middleware
 *
 *
 * Usage:
 *
 *     app.patch('/stories/:id', attach(model.findById), auth(['owner', 'editor']), stories.create);
 *
 * attach() is a small middleware that simply attaches to ctx.resource what its param function returns when called from inside attach().
 * This lets us keep the relevant code together. middleware in /middleware and the findById() is the /resources directory.
 *
 * auth() specifies authentication and its array specify the authorization adapters.
 *
 * Examples:
 *
 *     app.post('/stories', auth(), stories.create);
 *
 * @param {Array} adapters - Array of authorization adapters. TODO: Correct terminology!
 * @returns {*}
 */
function auth(adapters) {
    adapters = adapters || [];

    var authorized = false;

    return function* auth(next) {
        if (!this.user) {
            throw new AuthenticationError('Authentication is required.');
        }

        if (~adapters.indexOf('*')) {
            authorized = true;
        }

        if (~adapters.indexOf('admin')) {
            if (this.user.role === 'admin') {
                authorized = true;
            }
        }

        if (~adapters.indexOf('owner')) {
            if (!this.resource) {
                throw new Error('Resource not attached');
            }
            if (this.user.id === this.resource.user) {
                authorized = true;
            }
        }

        if (~adapters.indexOf('editor')) {
            if (!this.resource) {
                throw new Error('Resource not attached');
            }
            if (Array.isArray(this.resource.editors)) {
                if (~this.resource.editors.indexOf(this.user.id)) {
                    authorized = true;
                }
            }
        }

        if (authorized) {
            yield next;
        } else {
            throw new AuthorizationError('Proper authorization is required.');
        }
    };
}