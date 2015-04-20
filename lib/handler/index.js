var handler = {}
module.exports = handler;
module.exports.add = function(path, fn) {
  if (path && typeof fn === 'function'){
    handler[path] = fn;
  } else {
    console.error('invalid path or arguments[2] is not a function.' )
  }
}