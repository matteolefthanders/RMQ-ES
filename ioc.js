'use strict';
let path = require('path');
let components = path.join(path.dirname(require.resolve('express-building-blocks')), 'components');

let ioc = require('electrolyte');
ioc.use(ioc.dir(__dirname));
ioc.use('components', ioc.dir(components));
module.exports = ioc;