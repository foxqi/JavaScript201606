/**
 * Created by Administrator on 2016/7/27 0027.
 */
// createXHR ：创建AJAX对象，兼容所有的浏览器
function createXHR(){
   var xhr=null;
    flag=false;
    ary=[
        function () {
        return new XMLHttpRequest;
       },
    function () {
        return new ActiveXObject('Microsoft.XMLHTTP');
    },
    function () {
        return new ActiveXObject('Msxm12.XMLHTTP');
    },
    function () {
        return new ActiveXObject('Msxm13.XMLHTTP');
    }];
   for(var i= 0,len=ary.length;i<len ;i++){
        var curFn=ary[i];
       try{
           xhr=curFn();
           //本次循环获取的方法执行没有出现错误：说明此方法是我想要的，我们下一次直接执行这个小方法即可，这就需要我们把  重新为小方法(w完成后不需要再判断下面的了，直接退出即可)
           createXHR=curFn;
           flag=true;
           break;
       }catch(e){
           //本次循环获取的方法执行出现错误：继续执行下一次循环
       }
    }
    if(!flag){
        throw new Error('your browser is not support ajax,please change your browser,try again!')
    }
    return xhr;
}













