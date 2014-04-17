var model = require('./model');
var controller = require('./controller');
var auth = require('../../middleware/auth');
var attach = require('../../middleware/attach');

module.exports = function (app) {
    // Routes on the resource collection.
    app.get('/stories', controller.list);
    app.post('/stories', auth(['*']), controller.create);
    app.del('/stories', auth(['admin']), controller.deleteAll);

    // Routes on a single resource instance.
    // If routes needs authorization (and the access details are specified inside the resource itself) we need to
    // pre-fetch the resource and `attach` it to the request in order for `auth` to make use of it.
    app.get('/stories/:id', controller.show);
    app.patch('/stories/:id', attach(model.findById), auth(['owner', 'editor']), controller.update);
    app.del('/stories/:id', attach(model.findById), auth(['admin', 'owner']), controller.deleteOne);
};