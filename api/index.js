'use strict';

let // modules
  express = require('express');

let //
  ioc = require('../ioc'),
  fs = require('fs'),
  path = require('path'),
  iocPath = path.join(__dirname, '..'),
  util = require('util');



function walk (dir) {
  // Thanks to Mr.Coltrè
  let currentDir = {};
  fs.readdirSync(dir)
  .filter(function blacklist (file) {
    return !/.md|index|_|\.spec.js/.test(file);
  }).forEach(function (file) {
    let
      filePath = path.join(dir, file),
      stat = fs.statSync(filePath);

    let exportName = path.basename(file, '.js').replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    if (stat.isDirectory()) {
      currentDir[exportName] = walk(filePath);
    } else {
      currentDir[exportName] = ioc.create(path.relative(iocPath, filePath));
    }
  });
  return currentDir;
}

let api = walk(__dirname);

exports = module.exports = function ( expressify) {
  let router = express.Router();

  // API LIST
  router.get('/first/:error?',expressify(api.first));
  
  return router;
};

exports['@singleton'] = true;
exports['@require'] = ['components/expressify'];
