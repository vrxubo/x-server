#!/usr/bin/env node
var app = require('../index');
var types = require('../lib/resource/mine')
var cmd = process.argv[2];
switch (cmd) {
  case 'start':
    app.start();
    break;
  case 'types':
    var ext = process.argv[3];
    types.show(ext);
    break;
  default:
    console.error('不支持此命令:' + cmd);
}
