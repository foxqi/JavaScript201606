/**
 * Created by Administrator on 2016/7/27 0027.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
//创建一个服务
var server1=http.createServer(function(req,res){
    //解析客户端请求地址中的文件目录名称，以及传递给服务的数据内容
    var urlObj=url.parse(req.url,true);
    pathname=urlObj['pathname'];
    query=urlObj['query'];

//低级浏览器
    //处理静态资源文件的请求（html/css/js）-->'前端路由'
    var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO)/i;//还有图片的|JPG|GIF|PNG|BMP就不写了
    if(reg.test(pathname)){
        //获取请求文件的后缀名
        var suffix=reg.exec(pathname)[1].toUpperCase();

        //根据请求文件的后缀名获取到当前文件的类型-->MIME类型
        var suffixMIME='text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME='text/html';
                break;
            case 'CSS':
                suffixMIME='text/css';
                break;
            case 'JS':
                suffixMIME='text/javascript';
                break;
            case 'JSON':
                suffixMIME='application';
                break;

        }
        //按照指定的目录读取文件中的内容或者代码（读取出来的内容都是字符串格式的）
        try{
            var conFile=fs.readFileSync("."+pathname,"utf-8");
            //还需要重写响应头信息，告诉客户端的浏览器我返回的内容是什么样的MIME类型，指定返回的内容格式是UTF-8的编码，返回的中文汉字就不会出现乱码了
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});//不会出现乱码'text/html;charset=utf-8'
            //服务端向客户端返回的内容应该也是字符串
            res.end(conFile);
        }catch(e){
            res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
            res.end('request file is not find')
        }

}

//高级浏览器
    //如果客户端请求的资源文件不存在，我们不加try catch服务会终止，这样不好，所有我们添加try catch异常捕获信息，这样即使不存在，服务有不会报错，同样也不会终止

    try{
        var con=fs.readFileSync("."+pathname,"utf-8");
        res.end(con);
    }catch(e){
      res.end('request file is not find')
    }



});
//为当前的这个服务配置端口
server1.listen(1234,function(){
   console.log('server is success,listening on 1234 port!')
})







