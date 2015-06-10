var F = function () {};
var fs = require('fs');
exports.clone = function (o) {
  if (!o) {
    return null;
  }
  F.prototype = o;
  return new F();
};
exports.trim = function (str) {
  if (typeof str === 'string') {
    return str.replace(/^\s+|\s+$/g, '');
  }
};
exports.isInteger = function (str) {
  return /^(0[x]?)?\d+$/.test(str);
};
exports.isNumber = function (num) {
  return typeof num === 'number' && !isNaN(num);
};
exports.isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};
exports.isObject = function (o) {
  return o && typeof o === 'object';
};
exports.strIsNumber = function (str) {
  return this.isNumber(-str);
};
exports.pathFormat = function (str) {
  return str.replace(/[\\|\/]+/g,'/').replace(/\/*$/,'/');
};
exports.isFile = function(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
};
exports.isDirectory = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};
