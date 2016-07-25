/**
 * Created by Administrator on 2016/7/7 0007.
 */
function Banner(idName,interval){
    this.oBox = document.getElementById(idName)
    this.oBoxInner =this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div')
    this.aImg = this.oBoxInner.getElementsByTagName('img')
    this.oUl = this.oBox.getElementsByTagName('ul')[0]
    this.aLi = this.oBox.getElementsByTagName('li');
    this.oBtnLeft = this.oBox.getElementsByTagName('a')[0]
    this.oBtnRight = this.oBox.getElementsByTagName('a')[1]
    this.data=null
    this.step = 0;//用step=0来控制让那张图片显示
    this.autoTimer = null;
    this.interval = 2000;
    this.init();//初始化函数init中都是函数调用的思路
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        this.getData();
        this.bind();
        this.lazyImg();
        clearTimeout(this.autoTimer);
        this.autoTimer = setInterval(function(){
            _this.autoMove()
        }, this.interval)
        this.overOut();
        //点击焦点切换
        this.handleChange();
        //左右按钮切换
        this.leftRight();




    },
    getData:function getData(){
    var _this=this
    var xml=new XMLHttpRequest();
    //每一次加载出现避免缓存  -->?='+Math.random()
    xml.open('get','json/data.txt?='+Math.random(),false)
    xml.onreadystatechange=function(){
        if(xml.readyState===4&&/^2\d{2}$/.test(xml.status)){
            _this.data= utils.jsonParse(xml.responseText)
        }
    }
    xml.send(null);
        //console.log(_this.data)
},
    bind:function bind() {
    var str1 = '';//根据数据多少，进行字符串拼接div
    var str2 = '';//根据数据多少，进行字符串拼接li
    for (var i = 0; i < this.data.length; i++) {
        str1 += '<div><img realImg="' + this.data[i].imgSrc + '" alt=""/></div>';
        str2 += i === 0 ? '<li class="bg"></li>' : '<li></li>';
    }
        this.oBoxInner.innerHTML = str1;
        this.oUl.innerHTML = str2;
},
    lazyImg:function lazyImg() {
        var _this=this
    for (var i = 0; i < this.aImg.length; i++) {
        (function(index){
            var tmpImg = new Image;
            tmpImg.src = _this.aImg[index].getAttribute('realImg');
            tmpImg.onload = function (){
                _this.aImg[index].src = this.src
                utils.css(_this.aDiv[0], 'zIndex', 1)
                zhufengAnimate(_this.aDiv[0], {opacity: 1}, 500)
            }
        })(i)
    }

},
    autoMove:function autoMove() {
    if (this.step >= this.aDiv.length - 1) {
        this.step = -1;
    }
        this.step++;// 1 2 3 0不断累加step
        this.setBanner();// 1 2 3 0
},
    setBanner:function setBanner() {

    for (var i = 0; i < this.aDiv.length; i++) {
        var curEle = this.aDiv[i];
        if (i === this.step) {
            utils.css(curEle, 'zIndex', 1);
            zhufengAnimate(curEle, {opacity: 1}, 500, function () {
                var siblings = utils.siblings(this);
                for (var i = 0; i < siblings.length; i++) {
                    utils.css(siblings[i], 'opacity', 0)
                }
            });
        }
            utils.css(curEle, 'zIndex', 0);

    }

    //console.log(step)
       this.bannerTip()
},
    bannerTip:function bannerTip(){
    for (var i = 0; i < this.aLi.length; i++) {
        /*  if(i===step){
         aLi[i].className='bg'
         }else{
         aLi[i].className=''
         }*/
        var curEle = this.aLi[i]
        curEle.className = i === this.step ? 'bg' : ''
    }
},
    overOut:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.autoTimer);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='block';
        };
        this.oBox.onmouseout=function(){
            _this.autoTimer=setInterval(function(){
                _this.autoMove();
            },_this.interval);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='none';
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0; i<this.aLi.length; i++){
            (function(index){
                _this.aLi[index].onclick=function(){
                    _this.step=index;
                    _this.setBanner();
                }
            })(i);
        }
    },
    leftRight:function(){
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        this.oBtnLeft.onclick=function(){
            if(_this.step<=0){
                _this.step=_this.aDiv.length;
            }
            _this.step--;
            _this.setBanner();
        }
    }

}