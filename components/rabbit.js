'use strict';
// RABBIT EMITTER
let amqp = require('amqplib');
let clone = require('clone');

exports = module.exports = function (config) {
  let 
    ch = null,
    rabbit = {};

  amqp.connect(config.amqp.host)
  .then(function(con) {
    return con.createChannel();
  })
  .then(function(channel) {
    channel.assertExchange(config.elasticsearch.exchange.name, config.elasticsearch.exchange.type, { durable: true });
    ch = channel;  
  });

  
  rabbit[config.elasticsearch.infoIndex] = function (req, res) {
    var obj = { req: {}, res: {} };
    obj.req.time = new Date();
    obj.req.headers = req.headers;
    obj.req.url = req.url;
    obj.req.method = req.method;
    obj.req.params = req.params;
    obj.req.query = req.query;
    obj.req.body = (req.body) ? req.body : {};
    obj.res.value = clone(res);
    obj.res.time = new Date();
    let msg = JSON.stringify(obj)
    ch.publish(config.elasticsearch.exchange.name, config.elasticsearch.infoIndex,new Buffer(msg));
  }
  rabbit[config.elasticsearch.errorIndex] = function (req, e) {
    var obj = { req: {}, err: {} };
    obj.req.time = new Date();
    obj.req.headers = req.headers;
    obj.req.url = req.url;
    obj.req.method = req.method;
    obj.req.params = req.params;
    obj.req.query = req.query;
    obj.req.body = (req.body) ? req.body : {};
    obj.err.stack = e.stack;
    obj.err.name = e.name;
    obj.err.message = e.message;
    obj.err.time = new Date();
    let msg = JSON.stringify(obj)
    ch.publish(config.elasticsearch.exchange.name, config.elasticsearch.errorIndex,new Buffer(msg));
  }


// END RABBIT EMITTER
  

  return rabbit;
}

exports['@singleton'] = true;
exports['@require'] = ['config'];