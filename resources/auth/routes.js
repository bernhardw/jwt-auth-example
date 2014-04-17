var controller = require('./controller');

module.exports = function (app) {
    app.post('/auth', controller.authenticate);
};