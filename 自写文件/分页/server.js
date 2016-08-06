/**
 * Created by Administrator on 2016/8/2 0002.
 */

var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function(req,res){
     var urlObj=url.parse(req.url,true),
         pathname=urlObj['pathname'],
         query=urlObj['query'];

     var reg=/\.(HTML|CSS|JS)/i;
     if(reg.test(pathname)){
          var suffix=reg.exec(pathname)[1].toUpperCase(),
              suffixMIME=suffix==='HTML'?'text/html':(suffix==='CSS'?'text/css':'text/javascript');
          try{
              res.writeHead(200,{'content-type':suffixMIME+'charset=utf-8;'});
              res.end(fs.readFileSync('.'+pathname,'utf-8'))
          }catch(e){
              res.writeHead(404);
              res.end('file is not found~')

          }
     }



});
server1.listen(88,function(){
     console.log('server is success, listening on 88 port!')
})











