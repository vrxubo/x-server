var url = require('url');
var parse = require('./parse');

module.exports = function (req, cb) {
  if (!req || !req.url) {
    cb(new Error('无效的request'));
  }
  if (req.method && req.method.toLowerCase() === 'post') {
    var param = '';
    req.addListener('data', function (data) {
      param += data;
    });
    req.addListener('end', function () {
      cb(null, parse(param));
    });
  } else {
    cb(null, parse(url.parse(req.url).query));
  }
}