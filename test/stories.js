var app = require('../app');
var should = require('should');
var jwt = require('jsonwebtoken');
var request = require('supertest').agent(app.listen());

var config = require('../config/auth');
var users = require('../data/users');
var model = require('../resources/stories/model');

describe('Resource /stories:', function () {

    var stories = [];

    beforeEach(function () {
        model.loadData();
    });

    describe('GET /stories', function () {
        it('should list stories', function (done) {
            request
                .get('/stories')
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.have.length(2);
                    done();
                });
        });
    });

    describe('POST /stories', function () {
        it('should fail to create a new story with 401 without authentication', function (done) {
            var story = { title: 'Foo', content: 'Bar' };
            request
                .post('/stories')
                .send(story)
                .expect(401, done);
        });

        it('should create a new story with proper authentication', function (done) {
            var payload = { id: users[0].id };
            var token = jwt.sign(payload, config.secret);
            var story = { title: 'Foo', content: 'Bar' };
            request
                .post('/stories')
                .send(story)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', 'application/json')
                .expect(201, done);
        });
    });

    describe('DELETE /stories', function () {
        it('should fail to delete without authentication', function (done) {
            request
                .del('/stories')
                .expect(401, done);
        });

        it('should fail to delete without proper authorization', function (done) {
            var token = jwt.sign({ id: 2 }, config.secret);
            request
                .del('/stories')
                .set('Authorization', 'Bearer ' + token)
                .expect(403, done);
        });

        it('should delete all stories', function (done) {
            var token = jwt.sign({ id: 1, role: 'admin' }, config.secret);
            request
                .del('/stories')
                .set('Authorization', 'Bearer ' + token)
                .expect(204, done);
        });
    });

    describe('GET /stories/:id', function () {
        it('should get a story', function (done) {
            request
                .get('/stories/1')
                .expect('Content-Type', 'application/json')
                .expect(200, done);
        });
    });

    describe('PATCH /stories/:id', function () {
        it('should fail to update a story unauthenticated', function (done) {
            var story = { title: 'New' };
            request
                .patch('/stories/1')
                .send(story)
                .expect(401, done);
        });

        it('should fail to update a story unauthorized', function (done) {
            var token = jwt.sign({ id: 1 }, config.secret);
            var story = { title: 'New' };
            request
                .patch('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .send(story)
                .expect(403, done);
        });

        it('should fail to update a story as admin', function (done) {
            var token = jwt.sign({ id: 1, role: 'admin' }, config.secret);
            var story = { title: 'New' };
            request
                .patch('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .send(story)
                .expect(403, done);
        });

        it('should update a story as owner', function (done) {
            var token = jwt.sign({ id: 2 }, config.secret);
            var story = { title: 'New' };
            request
                .patch('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .send(story)
                .expect('Content-Type', 'application/json')
                .expect(200, done);
        });

        it('should update a story as editor', function (done) {
            var token = jwt.sign({ id: 3 }, config.secret);
            var story = { title: 'New' };
            request
                .patch('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .send(story)
                .expect('Content-Type', 'application/json')
                .expect(200, done);
        });
    });

    describe('DELETE /stories/:id', function () {
        it('should fail when unauthenticated', function (done) {
            request
                .del('/stories/1')
                .expect(401, done);
        });

        it('should fail when any user tries to delete', function (done) {
            var token = jwt.sign({ id: 3 }, config.secret);
            request
                .del('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .expect(403, done)
        });

        it('should let owner delete the story', function (done) {
            var token = jwt.sign({ id: 2 }, config.secret);
            request
                .del('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .expect(204, done)
        });

        it('should let admin delete the story', function (done) {
            var token = jwt.sign({ id: 1, role: 'admin' }, config.secret);
            request
                .del('/stories/1')
                .set('Authorization', 'Bearer ' + token)
                .expect(204, done);
        });
    });

});