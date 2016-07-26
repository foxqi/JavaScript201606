/**
 * Created by Administrator on 2016/7/7 0007.
 */
(function () {
    var oBox = document.getElementById('box')
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div')
    var aImg = oBoxInner.getElementsByTagName('img')
    var oUl = oBox.getElementsByTagName('ul')[0]
    var aLi = oBox.getElementsByTagName('li');
    var oBtnLeft = oBox.getElementsByTagName('a')[0]
    var oBtnRight = oBox.getElementsByTagName('a')[1]
    //utils.css(aDiv[0],'opacity',1)
    //通过js先让第一张图片显示
    zhufengAnimate(aDiv[0], {opacity: 1}, 1000)
    //var aA=oBox.getElementsByTagName('a');
    //console.log(aDiv.length)

    var step = 0;//用step=0来控制让那张图片显示
    var autoTimer = null;
    var interval = 2000;
    //1.图片渐隐渐现
    //开启一个定时器
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
        //通过遍历每个div，看哪个div的索引等于step，如果等于，就让这个div的层级变高为1，让其他div层级变0；
        //让层级为1的这张图片，让这张图片的透明度通过运动到达1，当运动结束后，让显示的这张图片的所有兄弟元素的透明度都为0，
        for (var i = 0; i < aDiv.length; i++) {
            var curEle = aDiv[i];
            if (i === step) {
                utils.css(curEle, 'zIndex', 1);
                zhufengAnimate(curEle, {opacity: 1}, 1000, function () {
                    // alert（i）-->   回调函数属于异步，异步中的i值一定会失效，是最大值
                    //    一般情况下，回调函数中的this是window，但是我们封装时通过call改变了回调函数中的this指向-curEle

                    //    让显示的这张图片的兄弟元素，透明度都为0
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

//    2.焦点自动轮播
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

//    3.移入移除
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
//    4.点击焦点手动切换
    handleChange();
    function handleChange() {
        for (var i = 0; i < aLi.length; i++) {
            //aLi[i].index=i;
            //aLi[i].onclick=function(){
            //    step=this.index;
            //    setBanner()
            //    bannerTip();
            //}
            (function (index) {
                aLi[index].onclick = function () {
                    step = index;
                    setBanner();
                    bannerTip();
                }
            })(i)
        }
    }

    //点击左右按钮进行切换
    oBtnLeft.onclick = function () {
        if (step <= 0) {
            step = aLi.length;
        }
        step--;
        setBanner()
        bannerTip()
    }
    oBtnRight.onclick = autoMove;

})()




















