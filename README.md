# x-server
前端开发辅助工具

##安装##
> npm install x-server 

##启动##
> x-server start

##路由规则配置文件
    ./lib/router/router.json
###格式###
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


