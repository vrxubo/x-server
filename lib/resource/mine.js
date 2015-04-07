var types= {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "shtml": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};
exports.types = types;
exports.define = function(extName, type) {
  if (extName && type) {
    if (types[extName]) {
      console.warn('will change ' + extName + ' extension from ' + types[extName] + ' to ' +type);
    }
    types[extName] = type;
  }
};
exports.show = function(ext) {
  if (ext) {
    console.log(types[ext]);
  }
  var result = '';
  for (var en in types) {
    result += en + ": " + types[en] + '\n'
  } 
  console.log(result);
};