var fs = require('fs');
var path = require('path');
var fileParse = require('./fileParse');
module.exports = function(dir, pathname, callback, encoding) {
  try {
    var stat = fs.lstatSync(path.join( dir, pathname));
    stat.isDirectory() ? readDir(dir, pathname, callback) : readFile(dir, pathname, callback, encoding);
  } catch (err) {
    callback(err);
  }
}
function readFile(dir, pathname, callback, encoding) {
  if (arguments.length < 2) {
    return;
  }
  if (typeof dir !== 'string') {
    return;
  }
  var filepath = dir;
  var arg3 = callback;
  switch (typeof pathname) {
    case 'function':
      callback = pathname;
      dir = path.dirname(dir);
      break;
    case 'string':
      filepath = path.join(dir, pathname);
      break;
    default:
      return;
  }
  encoding = encoding || (typeof arg3 === 'string' && arg3) || 'binary';
  var type = filepath.replace(/.*[\.\\\/]/gi, '').toLowerCase();
  var fileReader = fileParse[type] && fileParse[type].readFile || function(d, fp, cb, ec) {
    fs.readFile(fp, ec, cb);
  };
  fileReader(dir, filepath, callback, encoding);
}
function readDir(dir, pathname, callback) {
  var filepath = path.join(dir, pathname);
  console.log(dir, pathname)
  fs.readdir(filepath, function(err, files) {
    var html = "";
    if (!err){
      html = '<ul>';
      if (pathname !== '/'){
        html += '<li><a href="' + path.dirname(pathname).replace(/\\+/g, '/') + '">Parent Directory</a></li>';
      } 
      for (var i = 0, l = files.length; i < l; i++) {
        html += '<li><a href="' + path.join(pathname, files[i]).replace(/\\+/g, '/') + '">' + files[i] + '</a></li>';
      }
      html +='</ul>';
    }
    callback(err, html, 'utf8', 'html');
  });
}