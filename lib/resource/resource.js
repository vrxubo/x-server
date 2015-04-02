var fs = require('fs');
var path = require('path');
var join = path.join;
var dirname = path.dirname;
var mine = require('./mine');
var exception = require('../util/error');
var methods = {};
methods.shtml = require('./shtml');
function readFile(res, dir, pathname) {
  var filepath = join(dir , pathname);
  var type = path.extname(pathname).replace(/\.(\w+)$/, '$1');
  var m = methods[type] && methods[type].readFile || function(fp, root, cb) {
    fs.readFile(fp, 'binary', function(err, file) {
      cb(err, file, 'binary');
    });
  }
  m(filepath, dir, function(err, file, encoding) {
    if (err) {
      exception.error(res, 500, err);
    } else {
      res.writeHead(200, {'Content-Type': mine.types[type] || 'text/plain'});
      res.write(file, encoding);
      res.end();
    }
  })
}
function readDir(res, dir, pathname) {
  var filepath = join(dir , pathname);
  fs.readdir(filepath, function(err, files) {
    if (err) {
      exception.error(res, 500, err);;
    } else {
      var html = '<ul>';
      if (pathname !== '/'){
        html += '<li><a href="' + dirname(pathname) + '">Parent Directory</a></li>';
      } 
      for (var i = 0, l = files.length; i < l; i++) {
        html += '<li><a href="' + join(pathname, files[i]) + '">' + files[i] + '</a></li>';
      }
      html +='</ul>';
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html);
      res.end();
    }
  });
}
module.exports = function(req, res, config, callback) {
  var dir = config.directory;
  var pathname = config.pathname;
  try {
    var stat = fs.lstatSync(join( dir, pathname));
    stat.isDirectory() ? readDir(res, dir, pathname) : readFile(res, dir, pathname);
  } catch (err) {
    if (callback) {
      callback(req, res);
    } else {
      exception.error(res, 404, config.original + ' is not found.\n');
    } 
  }
}