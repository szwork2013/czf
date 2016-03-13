'use strict';

// require('babel-core/register');
require("babel-polyfill");


var config = require('../../config');
var supertest = require('supertest');
var mongoose = require('mongoose')
var request = supertest('http://localhost:'+config.port);
var should = require('should');


var jwt = require('jsonwebtoken');

var connectDB = require('../../models').connectDB;
var Users = require('../../models').Users;
var AuthCodes = require('../../models').AuthCodes;
var testMobile = '13710248411'
var testCode = '123456'
var testPassword = '123456'
var testDigest = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
var testAlgorithm = 'sha-256'
var testEmail = '546113328@qq.com'
var testName = 'Welkinm-陈'


describe('-- account', () => {
  before(async (done) => {
    if (mongoose.connection.db) return done();
    try {
      await connectDB({NODE_ENV: 'test'});
    } catch(err) {
      done(err)
    }
    done()
  });

  describe('-- createAccount by mobile', () => {
    before(async (done) => {
      try {
        let user = null
        user = await Users.findOne({mobile: testMobile}).exec()
        if (user) {
          await Users.remove({mobile: testMobile}).exec()
        }
        user = await Users.findOne({email: testEmail}).exec()
        if (user) {
          await Users.remove({email: testEmail}).exec()
        }
      } catch(err) {
        done(err)
      }
      done()
    })

    // after(async (done) => {
    //   try {
    //     let user = null
    //     await Users.remove({mobile: testMobile}).exec()
    //   } catch(err) {
    //     done(err)
    //   }
    //   done()
    // })

    it('-- should check parameter: mobile or email is require', async (done) => {
      request.post('/api/v1/account')
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

    it('-- should check parameter: password is require', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({mobile: '23333', code: '123423'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })

    it('-- should check parameter: mobile format wrong', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({mobile: '23333', password: testPassword})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })
    it('-- should check parameter: auth code', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({mobile: testMobile, password: testPassword, code: '123423'})
        .expect(401)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })
    it('-- should create account by mobile', async (done) => {
      try {
          let newCode = {
          mobile: testMobile,
          code: testCode,
          msg: 'for test'
        };
        await AuthCodes.create(newCode);
      } catch(err) {
        done(err)
      }
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({firstName: testName, mobile: testMobile, password: testPassword, code: testCode})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          data.should.have.property('token')
          data.should.have.property('user')
          let user = data.user
          user.should.have.property('_id');
          user.should.have.property('mobile', testMobile);
          user.should.have.property('confirmed', true);
          user.should.have.property('confirmedMobile', true);
          done()
        })
    })
  })

  describe('-- createAccount by email', () => {
    before(async (done) => {
      try {
        let user = null
        user = await Users.findOne({email: testEmail}).exec()
        if (user) {
          await Users.remove({email: testEmail}).exec()
        }
      } catch(err) {
        done(err)
      }
      done()
    })

    // after(async (done) => {
    //   try {
    //     let user = null
    //     await Users.remove({email: testEmail}).exec()
    //   } catch(err) {
    //     done(err)
    //   }
    //   done()
    // })

    it('-- should check parameter: mobile or email is require', async (done) => {
      request.post('/api/v1/account')
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
    it('-- should check parameter: password is require', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({email: '23333'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })
    it('-- should check parameter: email format', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({email: 'cwlfsaa2da', password: testPassword})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })
    it('-- should create account by email', async (done) => {
      request.post('/api/v1/account')
        .set('Accept', 'application/json')
        .send({firstName: testName, email: testEmail, password: testPassword})
        .expect(202)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          should(data.token).not.be.ok();
          data.should.have.property('user')
          let user = data.user
          user.should.have.property('_id');
          user.should.have.property('email', testEmail);
          user.should.have.property('confirmed', false);
          user.should.have.property('confirmedEmail', false);
          done()
        })
    })
  })

  describe('-- confirm with email', () => {
    it('-- should check parameter: token encrytp',  async (done) => {
      request.get('/api/v1/mail/confirm?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9')
        .set('Accept', 'application/json')
        .expect(403)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })

    it('-- should confirm user',  async (done) => {
      let user = await Users.findOne({email: testEmail});
      let token = jwt.sign({
          type: 'confirm',
          id: user._id
        }, config.jwtConfirm.jwtSecret, {
          expiresIn: config.confirmMailExpiryMinutes * 60
        });
      request.get('/api/v1/mail/confirm?token='+token)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done()
        })
    })
  })

  describe('-- login by mobile', () => {
    before(async (done) => {
      try {
        await AuthCodes.remove({mobile: testMobile});
        done()
      } catch(err) {
        done(err)
      }
    })

    it('-- should check authCode', async (done) => {
      request.post('/api/v1/signin/mobile')
        .set('Accept', 'application/json')
        .send({mobile: testMobile, code: '2'})
        .expect(401)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          should(data.token).not.be.ok();
          should(data.user).not.be.ok();
          done()
        })
    })

    it('-- should login success', async (done) => {
      new Promise((resolve, reject) => {
        request.post('/api/v1/authCode')
          .set('Accept', 'application/json')
          .send({mobile: testMobile})
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end((err, res) => {
            if (err) {
              return reject(err);
            }
            resolve()
          })
      }).then(() => {
        return new Promise((resolve, reject) => {
          request.post('/api/v1/signin/mobile')
            .set('Accept', 'application/json')
            .send({mobile: testMobile, code: testCode})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
              if (err) {
                return reject(err);
              }
              res.body.should.have.property('data')
              let data = res.body.data
              data.should.have.property('token')
              data.should.have.property('user')
              let user = data.user
              user.should.have.property('_id');
              user.should.have.property('mobile', testMobile);
              user.should.have.property('confirmed', true);
              user.should.have.property('confirmedMobile', true);
              resolve()
            })
        })
      }).then(() => {
        done()
      }).catch((err) => {
        done(err);
      })
    })
  })


  describe('-- login by name', () => {
    it('-- should check name', async (done) => {
      request.post('/api/v1/signin/name')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          should(data.token).not.be.ok();
          should(data.user).not.be.ok();
          done()
        })
    })

    it('-- should login mobile success', async (done) => {
      request.post('/api/v1/signin/name')
        .set('Accept', 'application/json')
        .send({name: testMobile, password: {algorithm: 'sha-256', digest: testDigest}})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          data.should.have.property('token')
          data.should.have.property('user')
          let user = data.user
          user.should.have.property('_id');
          user.should.have.property('mobile', testMobile);
          user.should.have.property('confirmed', true);
          user.should.have.property('confirmedMobile', true);
          done()
        })
    })

    it('-- should login email success', async (done) => {
      request.post('/api/v1/signin/name')
        .set('Accept', 'application/json')
        .send({name: testEmail, password: {algorithm: 'sha-256', digest: testDigest}})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.property('data')
          let data = res.body.data
          data.should.have.property('token')
          data.should.have.property('user')
          let user = data.user
          user.should.have.property('_id');
          user.should.have.property('email', testEmail);
          user.should.have.property('confirmed', true);
          user.should.have.property('confirmedEmail', true);
          done()
        })
    })

  })
})