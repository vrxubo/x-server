function FileParse() {
  this.shtml = require('./shtml');
}
FileParse.prototype.set = function(type, parseFn) {
  if (typeof type == 'string' && typeof parseFn == 'function') {
    this[type] = { readFile: parseFn };
  } else {
    console.error('invalid file type or argumens[2] is not a function')
  }
}
module.exports = new FileParse;