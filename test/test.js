var should = require('should');
var request = require('supertest');
var server = require('../app');

describe('index', function() {
  describe('GET /', function() {
    it('should return a default string', function(done) {
      request(server)
        .get('/')
        .expect('Content-type', 'text/html; charset=utf-8')
        .expect(200)
        .end(function(err, res) {
          res.status.should.eql(200);
          done();

      });
    });
  });
});

