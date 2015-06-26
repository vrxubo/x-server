var fs = require('fs');
var template = require('./template.json');
var root = template.feDir;
var util = require('../util/util');
var server = require('../server/server');
var cache = {};
var validDirectory = function(dir) {
  if (!util.isDirectory(dir)) {
    console.error('invalid directory path .' + dir );
    return false;
  }
  return true;
};
var getPortRoot = function(port) {
  port = port || template.defaultPort;
  var dev = /^core[\s\S]*$/.test(port) ? '/' : '/dev/';
  var names = [].splice.call(arguments,1);
  var dir = names.length ? names.join('/') : '';
  return util.pathFormat(root + dev + port.replace(/\.|\s*$/g, '/') + dir);
};
var listBranches = function(port) {
  var path = getPortRoot(port, 'branches');
  if (validDirectory(path)) {
    return fs.readdirSync(path);
  }
  return [];
};
exports.showFe = function() {
  console.log(template.feDir);
}
exports.setFe = function(dir) {
  if(util.isDirectory(dir)) {
    template.feDir = util.pathFormat(dir);
    fs.writeFile(__dirname + '/template.json', JSON.stringify(template), function(err){
      if (err) {
        console.error(err);
        return;
      }
      console.log('success.\n now fe directory is ' + template.feDir);
    });
  }
};
exports.showPort = function() {
  console.log(template.defaultPort);
}
exports.set = function(port) {
  if (!port || port === template.defaultPort) {
    return;
  }
  template.defaultPort = port;
  fs.writeFile(__dirname + '/template.json', JSON.stringify(template), function(err){
    if (err) {
      console.error(err);
      return;
    }
    console.log('success.\n now default port is ' + template.defaultPort);
  });
}
exports.trans = function(branch, port) {
  branch = branch || branch === 0 ? branch : 'trunk';
  port = port || template.defaultPort;
  var trunk = '';
  var host = (port + '.lietou-static.com').replace(/\.+/g, '.');
  if (branch === 'trunk') {
    if (/^core\.(h5|pc)$/.test(port)) {
      trunk = getPortRoot(port, branch);
    }
  } else {
    var files = cache[port] || listBranches(port);
    var dirname = ~files.indexOf(branch) && branch || files[branch];
    if (dirname) {
      trunk = getPortRoot(port, 'branches', dirname);
    } else {
      console.error('not fount branch :' + branch)
      return;
    }
  }
  template.list["core.pc.lietou-static.com"] = util.pathFormat(root + '/core/pc/trunk');
  template.list["core.h5.lietou-static.com"] = util.pathFormat(root + '/core/h5/trunk');
  template.list[host] = trunk;
  template.list["*lietou-static.com"].directory = root;
  template.list["*pages.com"].directory = util.pathFormat(root + '/dev');
  var content = JSON.stringify(template);
  fs.writeFile(__dirname + '/../router/router.json', content, function(err){
    if (err) {
      console.error(err);
      return;
    }
    console.log('success');
    console.dir(template);
  });
};
exports.clearCache = function(port) {
  if (port) {
    cache[port] = null;
    return;
  }
  cache = {};
};

exports.showBranches = function(port) {
  var files = listBranches(port) || [];
  files.forEach(function(o, i){
    console.log(i + '   ' + o);
  });
  cache[port] = files;
};
