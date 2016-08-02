/**
 * Created by 银鹏 on 2016/7/30.
 */
var fs = require('fs'); // file stream


/**
 * 读取文件
 * @param path 路径信息
 * @param response http响应
 */
var readFile = function (path, response) {
    // 格式化文件路径,把根目录标识去掉
    path = '..' + path;
    // 检测文件是否存在
    fs.exists(path, function (isExists) {
        if (isExists) {
            // 读取文件
            fs.readFile(path, function (err, data) {
                // 判断读取文件是否失败
                if (err) {
                    // 服务器内部错误
                    response.writeHead(500);
                    response.end('server internal error')
                } else {
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

module.exports = readFile;