var F = function () {};
exports.clone = function (o) {
  if (!o) {
    return null;
  }
  F.prototype = o;
  return new F();
}
exports.trim = function (str) {
  if (typeof str === 'string') {
    return str.replace(/^\s+|\s+$/g, '');
  }
}
exports.isNumber = function (num) {
  return typeof num === 'number' && !isNaN(num);
}
exports.isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
exports.isObject = function (o) {
  return o && typeof o === 'object';
}
exports.strIsNumber = function (str) {
  return this.isNumber(-str);
}
exports.pathFormat = function (str) {
  return str.replace(/[\\|\/]+/g,'/').replace(/\/*$/,'/');
}
