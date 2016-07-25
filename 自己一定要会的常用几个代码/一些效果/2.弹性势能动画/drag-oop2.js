/**
 * Created by Administrator on 2016/7/23 0023.
 */
/*
* 拖拽产品1.0版本
* 实现了最基本的拖拽功能
* 可以让用户来根据自己的需求来扩展和拖拽相关的其他功能
* 设计指导原则
* 拖拽开始的事件类型设定为 dragstart
* 拖拽进行的事件类型设定为 drag
* 拖拽结束的事件类型设定为 dragend
*
* 使用说明
* 一.如果打算在拖拽的某个阶段扩展新的功能，请使用如下事件
*   拖拽开始的事件类型设定为 dragstart
*   拖拽进行的事件类型设定为 drag
*   拖拽结束的事件类型设定为 dragend
*一.二 通过事件绑定的方法，被绑定的方法在运行的时候，this会指向Drag类的实例
* 二.如果您想使用被拖拽的元素，此元素保存在实例的ele属性中
*
*
* 拖拽产品的升级
* 拖拽产品1.1版
* 增加的功能：
* 1.可以在限定范围内拖拽
*
*拖拽产品的升级
* 升级到1.2版
* 加一拖拽的时候加边框
*当按下去的时候，给被拖拽元素叫一个虚边框，当鼠标抬起来的时候，把虚框在去掉
* */
function EventEmitter(){}
EventEmitter.prototype.on=function(type,fn){
    if(!this["aEmitter"+type]){
        this["aEmitter"+type]=[];
    }
    var a=this["aEmitter"+type];
    for(var i=0;i< a.length;i++){
        if(a[i]==fn)return;
    }
    a.push(fn);
    return this;//实现链式写法的关键
};
EventEmitter.prototype.run=function(type,e){

    var a=this["aEmitter"+type];
    if(a&& a.length){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]==='function'){

                a[i].apply(this,[].slice.call(arguments,1))
            }else{
                a.splice(i,1);
                i--;
                }
            }
        }
    };
EventEmitter.prototype.off=function(type,fn){
    var a=this["aEmitter"+type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(a[i]==fn){
                a[i]=null;
                return;
            }
        }
     }

  };



//当用new去运算一个构造函数的时候，发生了那几件事；
//1.创建了一个此类的实例，并且将此实例返回
//2.这个实例自动就具有__proto__这个属性（表示他自动拥有类的原型上的方法了）
//3.以此实例为上下文构造函数运行
function Drag(ele){

    this.ele=ele;
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;

    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,"mousedown",this.DOWN);

}
Drag.prototype=new EventEmitter;
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx= e.pageX;
    this.my= e.pageY;

    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,"mousemove",this.MOVE);
        on(this.ele,"mouseup",this.UP);
    }else{
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();
    this.run('dragstart',e)

};
Drag.prototype.move=function(e){
    this.ele.style.left=this.x+(e.pageX-this.mx)+'px';
    this.ele.style.top=this.y+(e.pageY-this.my)+'px';
    this.run('draging',e)

};
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,"mousemove",this.MOVE);
        off(this.ele,"mouseup",this.UP);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    this.run('dragend',e)
};

Drag.prototype.range=function(oRange){
    // oRange={l:0,r:800,t:0,b:300};//参数oRange是一个对象格式数据，他有四个属性，oRange.l表示拖拽左边界，r表示右边界，t表示是个上边界，b表示下边界
    this.oRange=oRange;
    this.on('draging',this.addRange);

};
Drag.prototype.addRange=function(e){
        var oRange=this.oRange;
        //把各方向的边界值给短变量，以方便书写
        var l=oRange.l,r=oRange.r,t=oRange.t,b=oRange.b;
        //把正常拖拽情况下水平方向的值和垂直方向的值计算出来
        var currentL=this.x+(e.pageX-this.mx);
        var currentT=this.y+(e.pageY-this.my);
        //以下开始做判断
        if(currentL<=l){
            this.ele.style.left=l+'px';
        }else if(currentL>=r){
            this.ele.style.left=r+'px';
        }else{
            this.ele.style.left=currentL+'px';
        }
        if(currentT<=t){
            this.ele.style.top=t+'px';
        }else if(currentT>=b){
            this.ele.style.top=b+'px';
            console.log(currentT)
        }else{
            this.ele.style.top=currentT+'px';
        }
        /* with(this.ele.style){//表示在操作以下变量的时候，以this.ele.style为上下文。以操作以下的属性的时候，先在this.ele.style中查找有没有这个属性，如果有这个属性，则表示在操作this.ele.style的这个属性，如果没有，则往上查找
        //比如currentL和this.ele.style
        if(currentL<=l){
            left=l+'px';
        }else if(currentL>=r){
            left=r+'px';
        }else{
            left=currentL+'px';
        }
        if(currentT<=t){
            top=t+'px';
        }else if(currentT>=b){
            top=b+'px';
        }else{
            top=currentT+'px';
        }*/

};

///*var obj1=new Drag(div1);
//obj1.range({});
//var obj2=new Drag(div2);*/
Drag.prototype.border=function(){
    this.on('dragstart',this.addBorder);
    this.on('dragend',this.removeBorder);
};
Drag.prototype.addBorder=function(){
    this.ele.style.border='black dashed 2px';
};
Drag.prototype.removeBorder=function(){
    this.ele.style.border=null;
}

















