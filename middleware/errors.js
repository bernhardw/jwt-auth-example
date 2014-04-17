/**
 *
 * @type {errors}
 */
module.exports = errors;

/**
 * Errors middleware.
 *
 * This middleware intercepts application errors and responds accordingly to the outside world.
 *
 * @param opts
 * @returns {errors}
 */
function errors(opts) {
    opts = opts || {};

    return function* errors(next) {
        try {
            yield next;
        } catch (err) {
            switch (err.name) {
                case 'AuthenticationError':
                    this.status = 401;
                    break;
                case 'AuthorizationError':

                    this.status = 403;
                    break;
                default:
                    this.status = err.status || 500;
                    break;
            }

            if (this.status !== 404) {
                this.body = {
                    status: this.status,
                    message: err.message || require('http').STATUS_CODES[this.status]
                };
            }

            this.app.emit('error', err, this);
        }
    };
}