/**
 * Created by Administrator on 2016/7/7 0007.
 */
(function(){
    //1.获取数据 2.绑定数据 3.延迟加载 4.自动渐隐渐嫌轮播图  5.焦点自动轮播  6.移入移除 7.点击焦点手动切换8.点击左右按钮进行切换
    var oBox = document.getElementById('box');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div')
    var aImg = oBoxInner.getElementsByTagName('img')
    var oUl = oBox.getElementsByTagName('ul')[0]
    var aLi = oBox.getElementsByTagName('li');
    var oBtnLeft = oBox.getElementsByTagName('a')[0]
    var oBtnRight = oBox.getElementsByTagName('a')[1]
    var data=null
    var step = 0;//用step=0来控制让那张图片显示
    var autoTimer = null;
    var interval = 2000;
//1.获取数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest();
        //每一次加载出现避免缓存  -->?='+Math.random()
        xml.open('get','json/data.txt?='+Math.random(),false)
        xml.onreadystatechange=function(){
            if(xml.readyState===4&&/^2\d{2}$/.test(xml.status)){
                data= utils.jsonParse(xml.responseText)
            }
        }
        xml.send(null);
        //console.log(data)
    }
//    2.绑定数据
    bind();
    function bind() {
        var str1 = '';//根据数据多少，进行字符串拼接div
        var str2 = '';//根据数据多少，进行字符串拼接li
        for (var i = 0; i < data.length; i++) {
            str1 += '<div><img realImg="' + data[i].imgSrc + '" alt=""/></div>';
            str2 += i === 0 ? '<li class="bg"></li>' : '<li></li>';
        }
        oBoxInner.innerHTML = str1;
        oUl.innerHTML = str2;
    }
//  3.延迟加载
    lazyImg();
    function lazyImg() {
        for (var i = 0; i < aImg.length; i++) {
            var tmpImg = new Image;
            tmpImg.src = aImg[i].getAttribute('realImg');
            tmpImg.index = i;
            //console.log(tmpImg.src)
            tmpImg.onload = function () {//  是异步，里面的i值一定会出问题
                aImg[this.index].src = this.src
                utils.css(aDiv[0],'zIndex',1)
                zhufengAnimate(aDiv[0],{opacity:1},500)
            }
        }
    }
//    4.图片渐隐渐现的自动轮播
    clearTimeout(autoTimer)//开启一个定时器前先关闭一个定时器
    autoTimer = setInterval(autoMove, interval)
    function autoMove() {
        if (step >= aDiv.length - 1) {
            step = -1;
        }
        step++;// 1 2 3 0不断累加step
        setBanner();// 1 2 3 0
    }

    function setBanner() {

        for (var i = 0; i < aDiv.length; i++) {
            var curEle = aDiv[i];
            if (i === step) {
                utils.css(curEle, 'zIndex', 1);
                zhufengAnimate(curEle, {opacity: 1}, 1000, function () {
                    var siblings = utils.siblings(this);
                    for (var i = 0; i < siblings.length; i++) {
                        utils.css(siblings[i], 'opacity', 0)
                    }
                });
                continue;
            }
            utils.css(curEle, 'zIndex', 0);
        }
        //console.log(step)
        bannerTip();
    }
    //    5.焦点自动轮播
//    思路：遍历每个焦点，判断哪个焦点的索引跟step相同，相同点亮，不相同不点亮
    function bannerTip() {
        for (var i = 0; i < aLi.length; i++) {
            /*  if(i===step){
             aLi[i].className='bg'
             }else{
             aLi[i].className=''
             }*/
            var curEle = aLi[i]
            curEle.className = i === step ? 'bg' : ''
        }
    }

//    6.移入移除
    oBox.onmouseover = function () {
        clearInterval(autoTimer)
        //utils.css(oBtnLeft,'display','block')
        //utils.css(oBtnRight,'display','block')
        oBtnLeft.style.display = oBtnRight.style.display = 'block'
    }
    oBox.onmouseout = function () {
        autoTimer = setInterval(autoMove, 1000);
        //utils.css(oBtnLeft,'display','none')
        //utils.css(oBtnRight,'display','none')
        oBtnLeft.style.display = oBtnRight.style.display = 'none'
    }
//    7.点击焦点手动切换
    handleChange();
    function handleChange() {
        for (var i = 0; i < aLi.length; i++) {
            //aLi[i].index=i;
            //aLi[i].onclick=function(){
            //    step=this.index;
            //    setBanner()
            //}
            (function (index) {
                aLi[index].onclick = function () {
                    step = index;
                    setBanner();
                }
            })(i)
        }
    }

    //8.点击左右按钮进行切换
    oBtnLeft.onclick = function () {
        if (step <= 0) {
            step = aLi.length;
        }
        step--;
        setBanner()
    }
    oBtnRight.onclick = autoMove;





})()