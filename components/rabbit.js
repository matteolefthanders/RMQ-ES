'use strict';
// RABBIT EMITTER
let amqp = require('amqplib');
let clone = require('clone');
const ex = 'topic_logs';
const key1 = 'info';
const key2 = 'error';



exports = module.exports = function () {
  let 
    ch = null,
    rabbit = {};

  amqp.connect('amqp://localhost')
  .then(function(con) {
    return con.createChannel();
  })
  .then(function(channel) {
    channel.assertExchange(ex, 'topic', { durable: true });
    ch = channel;  
  });

  
  rabbit['info'] = function (req, res) {
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
    ch.publish('topic_logs', key1,new Buffer(msg));
  }
  rabbit['error'] = function (req, e) {
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
    ch.publish('topic_logs', key2,new Buffer(msg));
  }


// END RABBIT EMITTER
  

  return rabbit;
}

exports['@singleton'] = true;