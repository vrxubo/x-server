var fs = require('fs');
var path = require('path');
module.exports.readFile = readFile = function (root, filepath, callback) {
  fs.readFile(filepath, 'utf8', function(err, file) {
    file = file || filepath+ ' not found';
    var includeFiles = file.match(/<!--#include[\s]+virtual=(["|'])(.*)(\1)[\s]*-->/gi);
    var len = includeFiles && includeFiles.length || 0;
    if (!len) {
      callback(null, file, 'utf8', 'shtml');
      return ;
    }
    var c = 0;
    includeFiles.forEach(function(include) {
      var fp = include.match(/\/.*\.(?:html|htm)/g);
      readFile(root, path.join(root, fp[0]), function(err, f) {
        c++;
        if (!err) {
          file = file.replace(include, f);
        } 
        if (c === len) {
          callback(err, file, 'utf8', 'shtml');
        }
      });
    });
  });
}