var app = require('../index');
var fs = require('fs');
var handler = app.handler;
handler.add('/index', function (req, res) {
  fs.readFile('./test/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      res.end(err.message);
    }
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(data, 'utf8');
  });
});
handler.add('/hello', function (req, res) {
  var query = app.query(req, function (err, data) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(data));
  });
});

app.start();