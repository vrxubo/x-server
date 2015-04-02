var fs = require('fs');
var path = require('path');
var filepath = process.argv[2];
module.exports.readFile = readFile = function (filepath, root, callback) {
  fs.readFile(filepath, 'utf8', function(err, file) {
    file = file || filepath+ ' not found';
    var includeFiles = file.match(/<!--#include[\s]+virtual=(["|'])(.*)(\1)[\s]*-->/g);
    var len = includeFiles && includeFiles.length || 0;
    if (!len) {
      callback(null, file, 'utf8');
      return ;
    }
    var c = 0;
    includeFiles.forEach(function(include) {
      var fp = include.match(/\/.*\.(?:html|htm)/g);
      readFile(path.join(root, fp[0]), root, function(err, f) {
        c++;
        if (!err) {
          file = file.replace(include, f);
        } 
        if (c === len) {
          callback(err, file, 'utf8');
        }
      });
    });
  });
}