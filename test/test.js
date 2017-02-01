const should = require('should');
const request = require('supertest');
const server = require('../app');

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
      it('it should response login page', function(done){
      const user = {
        id: 1,
        fullname: 'parita',
        emailid: 'parita@vivek.com',
        password: 'parita',
        image: 'twitter.jpg',
      }
      request(server)
        .post('/register')
        .send(user)
        .expect(302)
        .end(function (err, res) {
        console.log(err);
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
     });
   });
});
    describe('POST /login', function() {
      it('it should response header page', function(done){
      const user = {
        emailid: 'parita@vivek.com',
        password: 'parita',
      }
      request(server)
        .post('/login')
        .send(user)
        .expect(302)
        .end(function (err, res) {
        console.log(err);
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
     });
   });
 });

    describe('POST /header', function() {
      it('it should response header page', function(done){
      const user = {
        t_tweetText: 'Hello world',
        t_time: 'now()',
        t_userid: '1',
        t_likeCount: '',
      }
      request(server)
        .post('/header')
        .send(user)
        .expect(302)
        .end(function (err, res) {
        console.log(err);
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
     });
   });
 });

describe('POST /updateprofile', function() {
      it('it should response updtaeprofile page', function(done){
      const user = {
        fullname: 'hemangi',
        emailid: 'hemangi@hemangi.com',
        password: 'hemangi',
        image: 'twitter.jpg',
      }
      request(server)
        .post('/updateprofile')
        .send(user)
        .expect(302)
        .end(function (err, res) {
        console.log(err);
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
     });
   });
 });
