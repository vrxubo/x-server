#!/usr/bin/env node

var app = require('../index');
var cmd = process.argv[2];
switch (cmd) {
  case 'start':
    app.start();
    break;
  default:
    console.error('不支持此命令:' + cmd);
}