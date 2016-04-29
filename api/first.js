'use strict';

let // modules
  debug = require('debug')('api:retrieve:first');


exports = module.exports = function (rabbit) {

  function first (req) {
    let
  		error = (req.params.error) ? req.params.error : false,
  		prom ;

  	if (error) prom = new Promise(function(resolve) {  resolve(cosachenonesiste.boh)  });
  	else prom = new Promise(function(resolve){ resolve('First Api called'); })
  	

  	return prom
  	.then(function (res) {
  		rabbit['info'](req,res)
      return res; 
  	})
  	.catch(function (e) {
  		rabbit['error'](req,e);
      throw  new XError(1001).setHttpCode(419).setHttpResponse({ message: 'Errore' });
  	});

  }

  return first;
};

exports['@singleton'] = true;
exports['@require'] = ['components/rabbit.js'];
