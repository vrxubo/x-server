exports.error = function (res, statusCode, msg, type) {
  type = type || 'text/plain';
  res.writeHead(statusCode, {
    'Content-Type': type
  });
  res.write(msg + '\n');
  res.end();
}
