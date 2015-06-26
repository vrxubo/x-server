var url = require('url');
var parse = require('./parse');

module.exports = function (req, cb) {
  if (!req || !req.url) {
    cb(new Error('无效的request'));
  }
  if (req.method && req.method.toLowerCase() === 'post') {
    var params = [];
    var size = 0;
    req.addListener('data', function (data) {
      params.push(data);
      size += data.length;
    });
    req.addListener('end', function () {
      var buf = Buffer.concat(params, size);
      var str = buf.toString('utf8');
      cb(null, parse(str));
    });
  } else {
    cb(null, parse(url.parse(req.url).query));
  }
}
// querystring = require('querystring')
// console.log(querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' }))
