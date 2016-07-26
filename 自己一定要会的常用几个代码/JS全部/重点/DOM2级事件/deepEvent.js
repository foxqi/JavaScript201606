/**
 * Created by Administrator on 2016/7/20 0020.
 */
function on(curEle,eventType,eventFn){
   if(curEle.addEventListener){
       curEle.addEventListener(eventType,eventFn,false);
   } else{
       if(!curEle['myEvent'+eventType]){
           curEle['myEvent'+eventType]=[];
           curEle.attachEvent('on'+eventType,function(){run.call(curEle)});
       }
       var ary=curEle['myEvent'+eventType];
       for(var i=0;i<ary.length;i++){
           if(ary[i]===eventFn)return;
       }
       ary.push(eventFn)
   }
}

function off(curEle,eventType,eventFn){
    if(curEle.removeEventListener) {
        curEle.removeEventListener(eventType, eventFn, false);
    }else{
        var ary=curEle['myEvent'+eventType];
        for(var i=0;i<ary.length;i++){
            if(ary[i]===eventFn){
                ary[i]=null;
                break;
            }
        }
    }
}
function run(){
    var e= e||window.event;
    var eventType= e.type;
    var ary=this['myEvent'+eventType];
    if(ary&&ary.length){
        if(!e.target){
            e.target = e.srcElement;
            e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
            e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
            e.preventDefault = function () {
                e.returnValue = false;
            };
        }
        for(var i=0;i<ary.length;i++){
            if(typeof ary[i]=='function'){
                ary[i].call(this,e);
            }else{
                ary.splice(i,1);
                i--;
            }
        }
    }
}

