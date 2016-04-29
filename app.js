'use strict';
let path = require('path');

let // modules
  ioc = require('./ioc'),
  express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser');

  


require('./globals');

// Express starts here!
exports = module.exports = function (api, errorHandler) {

  let app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('view engine', 'j2');
  app.set('x-powered-by', false); // disable x-powered-by header
  app.set('trust proxy', 1); // use X-Forwarded-For header
  app.use(logger('dev')); 
  app.use(errorHandler);
  app.use('/api', api);

  return app;
};

exports['@singleton'] = true;
exports['@require'] = ['api', 'components/error-handler'];
