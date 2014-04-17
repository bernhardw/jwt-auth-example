var parse = require('co-body');
var model = require('./model');

exports.list = function* list() {
    this.body = model.list();
};

exports.create = function* create() {
    var parsed = yield parse.json(this);
    var story = {
        title: parsed.title,
        content: parsed.content
    };
    this.status = 201;
    this.body = model.create(story);
};

exports.deleteAll = function* deleteAll() {
    model.deleteAll();
    this.status = 204;
};

exports.show = function* show() {
    var story = model.findById(this.params.id);
    if (!story) {
        return;
    }
    this.body = story;
};

exports.update = function* update() {
    var id = this.params.id;
    var parsed = yield parse.json(this);
    var story = {};
    if (parsed.title) {
        story.title = parsed.title;
    }
    if (parsed.content) {
        story.content = parsed.content;
    }
    this.body = model.updateById(id, story);
};

exports.deleteOne = function* deleteOne() {
    model.deleteById(this.params.id);
    this.status = 204;
};