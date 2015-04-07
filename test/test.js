var app = require('../index');
var handler = app.handler;

handler.add('/hello', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('hello world');
});

app.start();