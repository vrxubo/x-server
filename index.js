var server = require('./lib/server/server');
var handler = require('./lib/handler')
exports.start = function() {
  server.start();
}
exports.handler = handler;