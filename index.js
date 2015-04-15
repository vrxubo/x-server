var server = require('./lib/server/server');
var query = require('./lib/util/querystring');
exports.handler = require('./lib/handler');
exports.start = server.start;
exports.query = query;