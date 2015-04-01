var server = require('./server/server');
var route = require('./route/route');
var handler = require('./handle/handler');
exports.start = function() {
  server.start(route, handler);
}
exports.handler = handler;
