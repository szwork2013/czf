'use strict';


// require('babel-core/register');
require("babel-polyfill");

var mongoose = require('mongoose')
var connectDB = require('../../models').connectDB;

describe('-- mongoose', () => {
  it('-- connect', async (done) => {
    if (mongoose.connection.db) return done();
    try {
      await connectDB({NODE_ENV: 'test'});
    } catch(err) {
      done(err)
    }
    done()
  });
})
