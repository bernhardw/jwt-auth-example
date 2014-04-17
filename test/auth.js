var app = require('../app');
var request = require('supertest').agent(app.listen());
var should = require('should');
var jwt = require('jsonwebtoken');

var config = require('../config/auth');
var users = require('../data/users');

describe('Resource /auth:', function () {

    describe('POST /auth', function () {

        it('should fail when user does not exist', function (done) {
            var payload = {
                email: 'foo@example.com',
                password: users[0].password
            };
            request
                .post('/auth')
                .send(payload)
                .expect(403, done);
        });

        it('should fail when password is incorrect', function (done) {
            var payload = {
                email: users[0].email,
                password: 'foo'
            };
            request
                .post('/auth')
                .send(payload)
                .expect(403, done);
        });

        it('should return a token when credentials are correct', function (done) {
            var payload = {
                email: users[1].email,
                password: users[1].password
            };
            request
                .post('/auth')
                .send(payload)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    jwt.verify(res.body.token, config.secret, function (err, decoded) {
                        if (err) return done(err);
                        decoded.id.should.equal(users[1].id);
                        decoded.should.not.have.property('role');
                        done();
                    });
                });
        });

        it('should return a admin token when credentials are correct', function (done) {
            var payload = {
                email: users[0].email,
                password: users[0].password
            };
            request
                .post('/auth')
                .send(payload)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    jwt.verify(res.body.token, config.secret, function (err, decoded) {
                        if (err) return done(err);
                        decoded.id.should.equal(users[0].id);
                        decoded.role.should.equal('admin');
                        done();
                    });
                });
        });

    });

});