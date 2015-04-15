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
    return str.replace(/^\s+|\s$/g, '');
  }
}