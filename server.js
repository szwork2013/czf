require('babel-core/register');
require("babel-polyfill");


const http = require('http');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const log = require('./utils/log').default;
const router = require('./router');
const mail = require('./utils/mail')
const config = require('./config');
const handleResponse = require('./middlewares/handle_response').default;

var app = express();
var startServer = () => {
  return new Promise((resolve, reject) => {
    //start server
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(handleResponse);

    app.use('/', router);

    app.use('*', (req, res, next) => {
      log.debug('router to *');
      res.sendFile(__dirname + '/public/index.html');
    });

    //error handler
    app.use((err, req, res, next) => {
      log.error(err);
      res.status(err.status || 500);
      res.end(err.message);
    });

    var server = http.createServer(app);
    var port = config.port || 6500;
    server.listen(port, error => {
      if (error) {
        log.error('CZF Server error:', error);
        reject();
      } else {
        log.info(`CZF Server v3 listening on port ${server.address().port}`);
        resolve();
      }
    });
  })
}
module.exports = app;

const models = require('./models');
const startCrontab = require('./crontab').start;             //start crontab jog
models.connectDB()                    //connect mongod
  .then(() => {
    // return mail.verify();
  }).then(() => {
    return models.init(false);        //init database if need
  }).then(() => {
    return startServer();             //start the server
  }).then(() => {
    return startCrontab();
  }).then(()=> {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
  }).catch((e)=>{
    log.error(e);
  });






