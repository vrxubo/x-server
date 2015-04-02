function handler() {
}
handler.prototype.add = function(path, fn) {
  this[path] = fn;
}
module.exports = new handler();