var route = require('../router/router');
function start(){
  var http = require('http');
  /**
   * 创建一个httpServer
   * 入参函数在发生http请求时触发
   */
  var server = http.createServer(function(request, response) {
    //使用url模块解析请求url
    // var pathname = url.parse(request.url).pathname;
    //定义一个变量接收post请求的数据
    // var postData = "";
    //路由请求
    // request.setEncoding('utf8');
    //给request绑定接收post请求数据的监听事件 将接收到的数据放到postData中
    // request.addListener('data', function(data) {
    //   postData += data;
    //   console.log(data);
    // });
    //给request绑定数据接收完成的事件   数据接收完成后 调用路由
    // request.addListener('end', function() {
      route( request, response);
    // });
    // var content = 'Hello World';
    //响应http请求 , 设置返回状态码为200 响应内容类型为text   还可以设置想要内容长度 'Content-Length'
    // response.writeHead(200, {
    //   'Content-Type': 'text/plain',
    //   'Content-Length': content.length
    // });
    // //写入响应内容
    // response.write(content);
    // //完成响应
    // response.end();

  });
  //令server监听8080端口
  server.listen(80);
  console.log('server is started, and listen 80');
}

//封装一个server模块  方便在其他的js中引用
exports.start = start;