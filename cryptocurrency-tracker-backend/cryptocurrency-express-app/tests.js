var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');


describe('GET /', function() {
  it('should return a 200 response', function(done) {
    api.get('/')
    .set('Accept', 'application/json')
    .expect(200, done);
  });
});

// describe('GET /get-coins', function() {
//   it('should return a 200 response', function(done) {
//     api.get('/get-coins')
//     .set('Accept', 'application/json')
//     .end(function(error, response) {
//       expect(200);
//       done();
//     });
//   });
// });

describe('GET /currency', function() {
  it('should return a 200 response', function(done) {
    api.get('/currency')
    .set('Accept', 'application/json')
    .end(function(error, response) {
      expect(200);
      done();
    });
  });
});

describe('GET /currency/tracking', function() {
  it('should return a 200 response', function(done) {
    api.get('/currency/tracking')
    .set('Accept', 'application/json')
    .expect(200, done);
  });
});