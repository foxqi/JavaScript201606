/**
 * Created by Administrator on 2016/7/6 0006.
 */
function Banner(idName,ajaxUrl,interval,effect){//构造函数:此时构造函数的this都是实例
   // 把全局变量都变成私有属性
   this.oBox=document.getElementById(idName)
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.oUl=this.oBox.getElementsByTagName('ul')[0]
    this.aDiv=this.oBoxInner.getElementsByTagName('div')
    this.aImg=this.oBoxInner.getElementsByTagName('img1');
    this.aLi=this.oBox.getElementsByTagName('li');
    this.aA=this.oBox.getElementsByTagName('a');
    this.data=null;
    this.step=0;
    this.autoTimer=null;
    this.interval =interval||1000;
    this.effect=effect||0
    this.ajaxUrl=ajaxUrl;
    this.init();//init被调用，getData才会被调用，系统帮创建一个this
}
//把全局函数都作为公有方法：公有方法都在prototype上
Banner.prototype={
    //用了大括号后：是自己给原型定义的空间，里面没有constructor的指向（一定注意constructor的指向）
    constructor:Banner,//自己定义的constructor的指向

    //初始化函数--这里放的都是函数调用的思路-->init为属性名：function是属性值，属性值也可以是方法
    init:function(){
        var _this=this;
        //2.解析数据
        this.getData();//这时的getData调用，只是放在这里等待执行
        //console.log(this.data)
        // 3.将数据绑定在页面上
        this.bind();
        // 4.延迟加载
        setTimeout(function(){
            _this.lazyImg();
        },300);//如果只是用this.lazyImg或者_this.lazyImg,只是定义阶段只是字符串，在300秒之后还会只是定义，而不是函数执行被调用了 _this.lazyImg()有括号就是函数被调用了;
        this.lazyImg();
        //    5.图片自动轮播
        clearInterval(this.autoTimer);//因为是关闭定时器，不是调用定时器，所以用this
        this.autoTimer=setInterval(function(){//开启定时器，让图片自动轮播
                _this.autoMove()
            }
            ,this.interval);
        //    6.焦点自动轮播
        this.bannerTip();
        //7. 移入移出
        this.overOut();
        // 8.点击焦点手动切换
        this.handleChange();
        // 9.点击左右按钮切换
        this.leftRight()

    },
    //2.解析数据
    getData:function getData(){
        //修改this：只要是以前的变量，现在都改成this.xxx（但是这个this是个实例，如果函数中的this不是实例的话，应该先保存实例到_this，然后再使用）
        var _this=this
        var xml=new XMLHttpRequest();
        //每一次加载出现避免缓存  -->?='+Math.random()
        xml.open('get',_this.ajaxUrl+'?='+Math.random(),false)
        xml.onreadystatechange=function(){
            if(xml.readyState===4&&/^2\d{2}$/.test(xml.status)){
                _this.data= utils.jsonParse(xml.responseText)
            }
        }
        xml.send(null);
        //console.log(this.data)
    },
    // 3.将数据绑定在页面上
    bind:function bind(){
        var str1='';//根据数据多少，进行字符串拼接div
        var str2='';//根据数据多少，进行字符串拼接li
        for(var i=0;i<this.data.length;i++){
            str1+='<div><img1 realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        //给str1在多拼接一个div索引为0的那一项
        str1+='<div><img1 realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        this.oBoxInner.innerHTML=str1;
        this.oUl.innerHTML=str2;
        //改变oBoxInner的宽度
        this.oBoxInner.style.width=this.aDiv.length*this.aDiv[0].offsetWidth+'px';

    },
    // 4.延迟加载
    lazyImg:function lazyImg(){
         for(var i=0;i<this.aImg.length;i++){
             //思路1：自定义属性避免异步问题
             /* var tmpImg=new Image;
              tmpImg.src=this.aImg[i].getAttribute('realImg');
              tmpImg.index=i;
              //console.log(tmpImg.src)
             var _this=this;
              tmpImg.onload=function(){//  是异步，里面的i值一定会出问题
              _this.aImg[this.index].src=this.src

              }*/
             //思路2.用闭包避免异步中的i值问题
             var _this=this;
             (function(index){
                 if(_this.aImg[index].loaded){
                     return
                 }
                 var tmpImg=new Image;
                 tmpImg.src=_this.aImg[index].getAttribute('realImg');
                 tmpImg.onload=function(){
                     _this.aImg[index].src=this.src;
                     tmpImg=null;
                     _this.aImg[index].loaded=true
                 };
                 tmpImg.onerror=function(){
                     tmpImg=null;
                 }
             })(i)
         }
     },
    //5.图片自动轮播
    autoMove:function autoMove(){
    if(this.step>=this.aDiv.length-1){
        this.step=0;
        utils.css(this.oBoxInner,'left',0)
    }
        this.step++;
    zhufengAnimate(this.oBoxInner,{left:-this.step*1000},500,this.effect);
    //console.log(step)
        this.bannerTip()
},
    //    6.焦点自动轮播
    bannerTip:function bannerTip(){
    var tmpStep=this.step>=this.aLi.length?0:this.step;
    for(var i=0;i<this.aLi.length;i++){
        i===tmpStep?utils.addClass(this.aLi[i],'bg'):utils.removeClass(this.aLi[i],'bg')
    }
},
    //7. 移入移出
    overOut:function overOut(){
        var _this=this
    this.oBox.onmouseover=function(){
        clearInterval(_this.autoTimer)
        _this.aA[0].style.display= _this.aA[1].style.display='block'

    }
    this.oBox.onmouseout=function(){
        _this.autoTimer=setInterval( function(){//开启定时器，让图片自动轮播
            _this.autoMove()
        },1000);
        //utils.css(aA[0],'display','none')
        //utils.css(aA[1],'display','none')
        _this.aA[0].style.display= _this.aA[1].style.display='none'
    }
},
    // 8.点击焦点手动切换
    handleChange:function  handleChange(){
        var _this=this;
    for(var i=0;i<this.aLi.length;i++){
        this.aLi[i].index=i;
        this.aLi[i].onclick=function(){
            _this.step=this.index;
            zhufengAnimate(_this.oBoxInner,{left:-_this.step*1000},500,_this.effect);
            _this.bannerTip();
        }
    }
},
    // 9.点击左右按钮切换
    leftRight:function leftRight(){
        var _this=this;
        this.aA[0].onclick=function(){
            if(_this.step<=0){
                _this.step= _this.aLi.length;
                utils.css( _this.oBoxInner,'left',- _this.step*1000)
            }
            _this.step--;
            zhufengAnimate( _this.oBoxInner,{left:- _this.step*1000},500,_this.effect)
            _this.bannerTip()
        };
        this.aA[1].onclick= function(){
            _this.autoMove();
        }
    }

}