var koa = require('koa');
var jwt = require('koa-jwt');
var json = require('koa-json');
var router = require('koa-router');
var errors = require('./middleware/errors');

var appConfig = require('./config/app');
var authConfig = require('./config/auth');

var app = module.exports = koa();

app.use(errors());

app.use(json());

// koa-jwt tries to decode the token and stores the claims on `this.user`.
// `passthrough: true` yields next even when no token or an invalid token is present. This lets us perform auth checks
// ourselves on this.user in a later middleware.
app.use(jwt({ secret: authConfig.secret, passthrough: true }));

app.use(router(app));

require('./resources/auth/routes')(app);
require('./resources/stories/routes')(app);

if (!module.parent) {
    app.listen(appConfig.port);
}