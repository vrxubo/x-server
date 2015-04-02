var conf = require('./router.json');
var getResource = require('../resource/resource');
var handler = require('../handler');
var url = require('url');
var cache = {};
var confList = conf.list;
var pattern = conf.pattern;
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
  getResource(req, res, config, handler[pathname]);
}
module.exports = route;