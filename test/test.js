var should = require('should');
var request = require('supertest');
var server = require('../app');

  describe('index', function() {

    describe('GET /', function() {

      it('should return a homepage', function(done) {

        request(server)
          .get('/')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
        });
      });
    describe('GET /register', function() {
      it('should return registration page', function(done) {

        request(server)
          .get('/register')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
      });
    });
    describe('GET /login', function() {
      it('should return login page', function(done) {

        request(server)
          .get('/login')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
        });
      });
    describe('GET /logout', function() {
      it('should return login page', function(done) {

        request(server)
          .get('/logout')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
        });
      });
    describe('GET /profile', function() {
      it('should return profile page', function(done) {

        request(server)
          .get('/profile')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
        });
      });
    describe('POST /register', function() {
      var user = {
        id: 1,
        fullname: 'vivek',
        emailid: 'vivek@vivek.com',
        password: 'vivek'
      }
      it('should return registration page', function(done) {

        request(server)
          .post('/register')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            res.status.should.be.equal(200);
            done();
          });
      });
    });
  });
