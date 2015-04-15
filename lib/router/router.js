var fs = require('fs');
var url = require('url');
var path = require('path');
var send = require('send');
var conf = require('./router.json');
var cache = {};
var pattern = conf.pattern;
var handler = require('../handler');
var confList = conf.list;
var shtmlReader = require('../resource/shtml');
/**
 * 根据正则替换传入的字符串
 * str 要替换的字符串
 * pattern包含两个部分
 *   1: regExp 正则表达式
 *   2: replace 替换规则
 * @return 返回替换后的字符串
 */
function replace(str, pattern) {
    var reg = pattern && pattern.regExp || null;
    if (str && reg) {
      return str.replace(new RegExp(reg), pattern.replace);
    }
    return str;
  }
  /**
   * 根据host和pathname和 route.json中配置的转发规则 生成实际的服务器端的url
   * 并将生成的url放入缓存, 下次请求的时候直接从缓存中获取数据
   */
function _getConfig(host, pathname) {
    var fullName = original = host + pathname;
    //如果缓存中存在则从缓存中获取
    if (cache[original]) {
      return cache[original];
    }
    //记录初始的url
    cache[original] = {
      original: decodeURI(original)
    };
    //pattern为route.json中的默认配置项  所有的url都会通过此规则过滤
    fullName = replace(fullName, pattern);
    //根据host从配置中获取配置项 若存在则根据配置规则,生成url
    var ruleObj = confList[host];
    if (!ruleObj) {
      for (var k in confList) {
        var patten = "^" + k.replace(/\./g, '\\.').replace('*', '.*') + "$";
        var reg = new RegExp(patten);
        if (reg.test(host)) {
          ruleObj = confList[k];
        }
      }
    }
    //若在配置文件中没有找到关于此host的配置 
    //则使用host匹配配置中的配置项(带有通配符的配置项)
    //匹配成功则使用该配置
    if (ruleObj) {
      if (typeof ruleObj === 'string') {
        cache[original].directory = decodeURI(ruleObj);
      } else if (typeof ruleObj === 'object') {
        fullName = replace(fullName, ruleObj);
        cache[original].directory = decodeURI(ruleObj.directory);
      }
    }
    //去掉url中的host(域名)部分, 并放入缓存
    cache[original].pathname = decodeURI(fullName.replace(/^[^\/]*(\/.*)$/, '$1'));
    return cache[original];
  }
  /**
   * 读取目录
   * 将目录下的文件放入到一个列表中,并在浏览器端展示
   * @param  {[type]} dir [目录路径]
   * @param  {[type]} res [响应response]
   */
function readDir(pathname, dir, res) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end(err.message);
        return;
      }
      var html = "";
      html = '<ul>';
      if (pathname !== '/') {
        html += '<li><a href="' + path.dirname(pathname).replace(/\\+/g, '/') + '">Parent Directory</a></li>';
      }
      for (var i = 0, l = files.length; i < l; i++) {
        html += '<li><a href="' + path.join(pathname, files[i]).replace(/\\+/g, '/') + '">' + files[i] + '</a></li>';
      }
      html += '</ul>';
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(html);
      res.end();
    });
  }
  /**
   * 路由
   *
   * 首先根据请求的pathname判断是否有针对此pathname的配置,
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
function route(req, res) {
  var host = req.headers.host;
  var urlObj = url.parse(req.url);
  var query = urlObj.query;
  var pathname = urlObj.pathname;
  var config = _getConfig(host, pathname);
  // 首先判断此次请求的Root目录是否存在,
  // 若目录不存在且没有配置针对此次请求的pathname的handler
  // 返回404的错误信息
  if (!config.directory && typeof handler[pathname] !== 'function') {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('file:(' + config.original + ') Not Found');
    return;
  }
  //根据pathname判断是否存在对应的handler,有则走handler
  if (typeof handler[pathname] === 'function') {
    return handler[pathname](req, res);
  }
  var fp = path.join(config.directory, config.pathname);
  var filetype = pathname.replace(/.*[\.\\\/]/gi, '').toLowerCase();
  //判断请求的是否是shtml文件 是则按照shtml文件解析并返回
  //否则通过send模块读取文件并返回给浏览器
  if (filetype === 'shtml') {
    shtmlReader.readFile(config.directory, fp, function (err, data, encoding, filetype) {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        res.end('file:(' + config.original + ') Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(data, encoding || 'utf8');
        res.end();
      }
    })
  } else {
    send(req, config.pathname, {
        root: config.directory
      })
      .on('error', function (err) {
        //若是根目录下找不到index.html则按目录处理
        if (err.status === 404 && pathname === '/') {
          readDir(config.pathname, fp, res);
        } else {
          res.statusCode = err.status || 500;
          res.end(err.message);
        }
      })
      .on('directory', function () {
        readDir(config.pathname, fp, res);
      }).pipe(res);
  }
}
module.exports = route;