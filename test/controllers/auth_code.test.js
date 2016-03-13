'use strict';

// require('babel-core/register');
require("babel-polyfill");


var config = require('../../config');
var supertest = require('supertest');
var mongoose = require('mongoose')
var request = supertest('http://localhost:'+config.port);
var should = require('should');

var connectDB = require('../../models').connectDB;
var AuthCodes = require('../../models').AuthCodes;
var testMobile = '13710248411'


describe('-- authCodes', () => {
  before(async (done) => {
    if (mongoose.connection.db) return done();
    try {
      await connectDB({NODE_ENV: 'test'});
    } catch(err) {
      done(err)
    }
    done()
  });

  describe('-- generateAuthCode', () => {
    before(async (done) => {
      try {
        let authCode = await AuthCodes.findOne({mobile: testMobile}).exec()
        if (authCode) {
          await AuthCodes.remove({mobile: testMobile}).exec()
        }
      } catch(err) {
        done(err)
      }
      done()
    })

    it('-- should check parameter: mobile', async (done) => {
      request.post('/api/v1/authCode')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done()
        })
    })

    it('-- should get auth code.', async (done) => {
      request.post('/api/v1/authCode')
        .set('Accept', 'application/json')
        .send({mobile: testMobile})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done()
        })
    })

    it('-- should limit auth code generate rate.', async (done) => {
      request.post('/api/v1/authCode')
        .set('Accept', 'application/json')
        .send({mobile: testMobile})
        .expect(429)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done()
        })
    })
  })
})