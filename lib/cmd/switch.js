var fs = require('fs');
var template = require('./template.json');
var root = template.feDir;
var util = require('../util/util');
var server = require('../server/server');
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
  return util.pathFormat(template.feDir + dev + port.replace(/\.|\s*$/g, '/') + dir);
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
    var root = template.feDir = util.pathFormat(dir);
    template.list["core.pc.lietou-static.com"] = util.pathFormat(root + '/core/pc/trunk');
    template.list["core.h5.lietou-static.com"] = util.pathFormat(root + '/core/h5/trunk');
    template.list["core.pc.pages.com"] = util.pathFormat(root + '/core/pc/pages');
    template.list["core.h5.pages.com"] = util.pathFormat(root + '/core/h5/pages');
    template.list["*lietou-static.com"].directory = root;
    template.list["*pages.com"].directory = util.pathFormat(root + '/dev');
    fs.writeFile(__dirname + '/template.json', JSON.stringify(template), function(err){
      if (err) {
        console.error(err);
        return;
      }
      console.log('success.\n now fe directory is ' + template.feDir);
    });
    console.dir(template);
  }
};
exports.showPort = function() {
  console.log(template.defaultPort);
}
exports.setPort = function(port, flag) {
  if (!port || port === template.defaultPort) {
    return;
  }
  template.defaultPort = port;
  if (flag) {
    fs.writeFile(__dirname + '/template.json', JSON.stringify(template), function(err){
      if (err) {
        console.error(err);
        return;
      }
      console.log('success.\n now default port is ' + template.defaultPort);
    });
  }
}

exports.setBranch = function(branch) {
  branch = branch || branch === 0 ? branch : 'trunk';
  port = template.defaultPort;
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
  template.list[host] = trunk;
}

exports.trans = function() {
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
exports.showBranches = function(port) {
  var files = listBranches(port) || [];
  files.forEach(function(o, i){
    console.log(i + '   ' + o);
  });
};
