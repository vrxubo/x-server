#!/usr/bin/env node
var app = require('../index');
var trans = require('../lib/cmd/switch');
var cmd = process.argv[2] || '';
var params = [].splice.call(process.argv, 3);
switch (cmd) {
  case 'start':
    app.start();
    break;
  case 'close':
    app.close();
    break;
  case 'restart':
    app.restart();
    break;
  case 'ls':
    trans.showBranches();
    break;
  case 'fe':
    var func = params.length ? trans.setFe : trans.showFe;
    func.apply(null,params);
    break;
  case 'p':
    var func = params.length ? trans.set : trans.showPort;
    func.apply(null,params);
    break;
  case '':
  case 't':
  case 'switch':
    trans.trans.apply(null, params);
    break;
  default:
    console.error('不支持此命令:' + cmd);
}
