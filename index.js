var server = require('./lib/server/server');
var resource = require('./lib/resource');
exports.handler = require('./lib/handler');
exports.types = resource.types;
exports.start = function() {
  server.start();
}
