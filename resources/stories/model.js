var stories = [];

// We need to clone the data to break their reference.
exports.loadData = function () {
    var data = require('./../../data/stories');
    stories = JSON.parse(JSON.stringify(data));
};

exports.list = function () {
    return stories;
};

exports.create = function (story) {
    story.id = stories.length + 1;
    stories.push(story);
    return story;
};

exports.findById = function (id) {
    for (var i = 0; i < stories.length; i++) {
        if (stories[i].id == id) {
            return stories[i];
        }
    }
    return false;
};

exports.deleteAll = function () {
    stories = [];
};

exports.deleteById = function (id) {
    for (var i = 0; i < stories.length; i++) {
        if (stories[i].id == id) {
            stories.splice(i, 1);
            return true;
        }
    }
    return false;
};

exports.updateById = function (id, story) {
    for (var i = 0; i < stories.length; i++) {
        if (stories[i].id == id) {
            for (var prop in story) {
                if (story.hasOwnProperty(prop)) {
                    stories[i][prop] = story[prop];
                }
            }
            return stories[i];
        }
    }
    return false;
};