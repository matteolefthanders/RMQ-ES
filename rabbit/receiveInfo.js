
var amqp = require('amqplib/callback_api');
var ioc = require('../ioc.js');
var elastic = ioc.create('components/elasticfeature');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    const ex = 'topic_logs';
    const key = 'info'

    ch.assertExchange(ex, 'topic', {durable: true});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      ch.bindQueue(q.queue, ex, key);
      ch.consume(q.queue, function(msg) {
        console.log(msg.content.toString());
        elastic['addInfo'](msg.content.toString());
        ch.ack(msg);
      }, {noAck: false});
    });
  });
});