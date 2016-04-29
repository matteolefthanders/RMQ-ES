
'use strict';

let // node
  fs = require('fs'),
  path = require('path');

let // modules
  extend = require('extend'),
  yaml = require('js-yaml');

exports = module.exports = function () {
  
  if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
  let
    db = require('./config.json')[process.env.NODE_ENV],
    configFile = `./${process.env.NODE_ENV}.yml`,
    configData = yaml.load(fs.readFileSync(path.join(__dirname, configFile)));
    
  return extend(true, {}, configData, { postgres: db });
};

exports['@singleton'] = true;
