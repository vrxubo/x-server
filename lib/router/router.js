var conf = require('./router.json');
var getResource = require('../resource/readFile');
var handler = require('../handler');
var url = require('url');
var cache = {};
var confList = conf.list;
var pattern = conf.pattern;
var mine = require('../resource/mine').types;
function replace(str, pattern) {
  var reg = pattern && pattern.regExp || null;
  if (str && reg) {
    return str.replace(new RegExp(reg), pattern.replace);
  }
  return str;
}
function _getConfig(host, pathname) {
  var fullName = original = host + pathname;
  if (cache[original]) {
    return cache[original];
  }
  cache[original] = {original:original};
  fullName = replace(fullName, pattern);
  var ruleObj = confList[host];
  if (!ruleObj) {
    for (var k in confList) {
      var patten = "^" + k.replace(/\./g, '\\.').replace('*', '.*') + "$";
      var reg = new RegExp(patten);
      if (reg.test(host)) {
        ruleObj = confList[k];
      }
    }
  }
  if (ruleObj) {
    if (typeof ruleObj === 'string') {
      cache[original].directory = ruleObj;
    } else if (typeof ruleObj === 'object') {
      fullName = replace(fullName, ruleObj);
      cache[original].directory = ruleObj.directory;
    }
  }
  cache[original].pathname = fullName.replace(/^[^\/]*(\/.*)$/, '$1');
  return cache[original];
}

function route(req, res) {
  var host = req.headers.host;
  var pathname = url.parse(req.url).pathname;
  var config = _getConfig(host, pathname);
  getResource( config.directory, config.pathname, function(err, data, encoding, filetype){
    if (err) {
      if(typeof handler[pathname]=== 'function') {
        handler[pathname](req, res);
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('file:(' + config.original + ') Not Found');
      }
    } else {
      filetype = filetype || pathname.replace(/.*[\.\\\/]/gi, '').toLowerCase();
      res.writeHead(200, {'Content-Type': mine[filetype] || 'text/plain'});
      res.write(data, encoding || 'binary');
      res.end();
    }
  });
}
module.exports = route;