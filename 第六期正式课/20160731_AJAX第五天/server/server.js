/**
 * Created by 银鹏 on 2016/7/30.
 */

// 获取http模块 用来创建http服务器
var http = require('http');
var querystring = require('querystring');
// 获取文件处理模块
var url = require('url');// 解析url为一个对象
var readFile = require('./readFile');
var bottleService = require('./bottleService');
var xMan = require('./xMan');
// 利用http模块 创建http服务器 回调函数有两个参数 第一个参数为http请求 第二个参数为http响应
var server = http.createServer(function (request, response) {
    // 把请求的url格式化为一个对象,方便操作
    var query = url.parse(request.url, true);

    if (query.pathname === '/getDriftingBottle') {
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(bottleService.get());
    } else if (query.pathname === '/throwDriftingBottle') {
        var chunk = '';
        request.on('data', function (data) {
            chunk += data;
        });
        request.on('end', function () {
            var obj = querystring.parse(chunk);
            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(bottleService.set({
                content: obj.content,
                date: Date.now()
            }));
        });
    } else if (query.pathname === '/jsonp') {
        // query是url对象
        // query.query是url中querystring对象
        // query.query.valName 是url中querystring对象里的valName
        var name = query.query.valName;
        if (!name) {
            name = 'byServer'
        }
        response.writeHead(200);
        //response.end('var ' + name + '="' + xMan + '"');
        response.end(name + '("' + xMan + '")');
    } else if (query.pathname === '/cors') {
        response.writeHead(200, {
            // 加上跨域资源共享响应首部
            'Access-Control-Allow-Origin': 'http://localhost:63342'
        });
        response.end('hello cors');
    } else {
        // 根据请求路径 处理文件
        readFile(query.pathname, response);
    }
});
// 端口最大设置为65535 监听端口
server.listen(12345, function () {
    console.log('server start over');
});
