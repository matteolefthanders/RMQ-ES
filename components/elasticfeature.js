'use strict';
let request = require('superagent');

exports = module.exports = function () {

	let client = {};
	
	client['addInfo']  = function (logObj) {
		return new Promise( function (resolve,reject) {
			request.post('localhost:9200/info/external')
			.send(logObj)
			.end( function (err, result) {
				if (result) {
					resolve(result);
				}
			  if (err) {
			    reject(err);
			  }
			});
		});
	}

	client['addError']  = function (logObj) {
		return new Promise( function (resolve,reject) {
			request.post('localhost:9200/error/external')
			.send(logObj)
			.end( function (err, result) {
			  if (result) console.log(result);
			  if (err) {
			    reject(err);
			  }
			});
		});
	}

	return client
}

exports['@singleton'] = true;
