/**
 * Created by 银鹏 on 2016/7/30.
 */
// 1 浏览器请求a.js
// 2 服务器收到a.js的请求,会校验请求首部中是否含有if-modified-since或者if-none-match
// 3 如果有这两个首部中的任何一个,则跟服务器上的a.js做校验
// 4 如果校验成功 返回 304 ,否则返回200 并且设置响应首部last-modified和etag

// 获取http模块 用来创建http服务器
var http = require('http');
// 获取文件处理模块
var fs = require('fs'); // file stream
var url = require('url');// 解析url为一个对象

/**
 * 读取文件
 * @param path 路径信息
 * @param response http响应
 */
var readFile = function (path, headers, response) {
    // 格式化文件路径,把根目录标识去掉
    path = path.slice(1);
    // 检测文件是否存在
    fs.exists(path, function (isExists) {
        if (isExists) {
            var since = null;
            var mtime = fs.statSync(path).mtime;
            if (since = headers['if-modified-since']) {
                if (since === mtime) {
                    response.writeHead(304);
                    return;
                }
            }

            // 读取文件
            fs.readFile(path, function (err, data) {
                // 判断读取文件是否失败
                if (err) {
                    // 服务器内部错误
                    response.writeHead(500);
                    response.end('server internal error')
                } else {
                    // 成功, 返回200
                    console.log(mtime);

                    response.end(data);
                }
            });
        } else {
            // 文件不存在 返回404
            response.writeHead(404);
            response.end('file not found')
        }
    });
};
// 利用http模块 创建http服务器 回调函数有两个参数 第一个参数为http请求 第二个参数为http响应
var server = http.createServer(function (request, response) {
    // 把请求的url格式化为一个对象,方便操作
    var query = url.parse(request.url, true);

    // 根据请求路径 处理文件
    readFile(query.pathname, request.headers, response);
});
// 端口最大设置为65535 监听端口
server.listen(12345, function () {
    console.log('server start over');
});
