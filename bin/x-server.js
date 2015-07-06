#!/usr/bin/env node
var app = require('../index');
var trans = require('../lib/cmd/switch');
var ArgumentParser = require('fsk-argparse');
var transform = false;
var argsParser = new ArgumentParser({
  sync: true,
  done: function() {
    if (transform === true) {
      trans.trans();
    }
  }
});
argsParser.add('-s', {
  dest: 'start',
  desc: '启动服务器',
  callback: function(args) {
    if (args && args.start === true){
      app.start();
    }
  }
});
argsParser.add('-c', {
  dest: 'close',
  desc: '关闭服务器, 暂不支持'
});
argsParser.add('-fe', {
  dest: 'fedir',
  desc: '设置或查看fe目录',
  sort: 8,
  callback: function(args) {
    if (args && args.fedir) {
      var fedir = args.fedir;
      if (fedir === true) {
        trans.showFe();
      } else {
        trans.setFe(fedir);
      }
    }
  }
});
argsParser.add('-b', {
  dest: 'branch',
  desc: '设置分支',
  sort: 6,
  callback: function(args) {

    if (args && args.branch) {
      if (args.branch === true) {
        trans.showBranches();
      } else {
        trans.setBranch(args.branch)
      }
    }
  }
});
argsParser.add('-p', {
  dest: 'port',
  desc: '设置默认端',
  sort: 7,
  callback: function(args) {
    if (args && args.port) {
      if (args.port === true) {
        trans.showPort();
      } else {
        trans.setPort(args.port, !transform);
      }
    }
  }
});
argsParser.add('-t', {
  dest: 'transform',
  desc: '重置配置文件',
  sort: 9,
  callback: function(args) {
    if (args.transform) {
      transform = true;
    }
  }
});
var args = argsParser.parse();
