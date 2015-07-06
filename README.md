# x-server
前端开发辅助工具

## 安装 ##
> npm install x-server

## 启动 ##
> x-server start

## 修改配置文件命令 ##

    > x-server -fe 你的fe目录路径     // 设置fe目录
    > x-server -p  默认端 如 c.h5     // 设置默认端
    > x-server -b  分支名|分支编号    // 切换到分支
    > x-server -t  保存配置文件       // 保存
    分支编号可以使用x-server -b命令查看
    必须有-t命令才可以会更新配置文件; 没有-t命令 -fe -p 只会被缓存, -b命令没有效果
    >x-server -p c.h5 -fe c:/work/fe -b 1 -t
    该命令会将fe目录更新为c:/work/fe
    将c.h5指向branches目录下的第一个分支
    并更新配置文件

## 查询配置信息的命令

    > x-server -fe   //查看fe目录
    > x-server -p    //查看业务端
    > x-server -b    //查看可配置的分支
    > x-server -h    //查看帮助


## 路由规则配置文件 ##
    ./lib/router/router.json
### 格式 ###
* pattern: 通用规则 ; 所有的url都会应用此规则转换 url.replace(regExp, replace) url包含域名
  * regExp : 正则表达式
  * replace: 替换规则
* list: 其他规则配置(可以根据不同的域名配置不同的根目录)
  * 支持(\*)通配符,但是优先完整域名配置
  * directory 域名指向的根目录
  * regExp 正则
  * replace 替换规则
  * 也可以直接配置根目录

 如下面的配置:

        {
            "pattern": {
            "regExp": "^([^\\/]*)(?:\\/revs){1}(.+)(?:_[a-z0-9]{8}){1}(.*)",
            "replace": "$1$2$3"
        },
        "list": {
            "*static.com": {
              "directory": "d:/work/fe",
              "regExp": "(?:http[s]?:\/\/)?(\\w+)\\.(\\w+)\\.static\\.com(.*)",
              "replace": "/dev/$1/$2/trunk$3"
            },
            "core.pc.static.com": "D:/work/fe"
          }
        }
若请求的url为http://c.pc.lietou-static.com/revs/v1/js/resume_12319023.js

        //c.pc.static.com 与*.static.com匹配
        //先进行通用规则转换
        url = "c.pc.static.com/revs/v1/js/resume_12319023.js".replace(/^([^\/]*)(?:\/revs){1}(.+)(?:_[a-z0-9]{8}){1}(.*)/, '$1$2$3');

        //url=c.pc.static.com/v1/js/resume.js
        //再执行*static.com的规则转换
        url.replace(/(?:http[s]?:\/\/)?(\w+)\.(\w+)\.static\.com(.*)"/,'/dev/$1/$2/trunk/$3');

        //最终生成相对于根目录的文件的绝对路径
        url=/dev/c/pc/trunk/v1/js/resume.js

        //文件在本地的真实路径
        d:/work/fe/dev/c/pc/trunk/v1/js/resume.js

 若请求的url为http://core.pc.static.com/revs/v1/js/resume_12319023.js

        //core.pc.static.com 优先匹配 "core.pc.static.com"
        //忽略*static.com 仅执行通用规则转换
        //最终生成的文件路径为:
        /v1/js/resume.js

## 自定义服务 ##
* 如果有需要也可以自定义请求处理,如:

        //引入x-server
        var app = require('x-server');
        var fs = require('fs');
        var handler = app.handler;
        handler.add('/index', function (req, res) {
         //自定义处理/index请求
        });
        handler.add('/hello', function (req, res) {
          //自定义处理 /hello请求
          //通过app.query获取传入的参数
          app.query(req, function (err, data) {
            //回调函数参数第一个为异常对象, 没有异常则为null
            //第二个参数为解析后的请求参数, 是一个json格式的数据
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(data));
          });
        });
        //启动服务
        app.start();
