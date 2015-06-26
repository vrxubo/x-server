var server = require('./lib/server/server');
var query = require('./lib/util/querystring');
var handler = require('./lib/handler');
exports.handler = handler;
exports.start = server.start;
exports.close = server.close;
exports.restart = server.restart;
exports.query = query;

