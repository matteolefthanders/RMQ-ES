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

    // in case is a dir, recurse
    if (stat.isDirectory()) {
      currentDir[exportName] = walk(filePath);
    } else {
      // console.log(path.relative(iocPath, filePath));
      currentDir[exportName] = ioc.create(path.relative(iocPath, filePath));
    }
  });
  return currentDir;
}

let api = walk(__dirname);

exports = module.exports = function ( expressify) {
  let router = express.Router();
  // router.use(passport.initialize());

  router.get('/',/* auth('any'),*/ function (req, res) {
    console.log('user:', req.user);
    res.json({ message: 'hooray! welcome to our api!' });
  });
  
  router.get('/first/:error?',expressify(api.first));
  

  return router;
};

exports['@singleton'] = true;
exports['@require'] = ['components/expressify'];
