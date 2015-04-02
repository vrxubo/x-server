#!/usr/bin/env node
var app = require('../index');
var cmd = process.argv[2];
if (cmd && cmd === 'start') {
  app.start();
} else {
  console.error('暂时只支持start命令');
}
