/**
 * Created by Administrator on 2016/6/28 0028.
 */
var utils=(function(){
    var flag='getComputedStyle' in window;
    //rnd：求一定范围的随机数
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();//如果传的数字无效，直接返回0-1的随机小数
        }
        if(n>m){
            tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n)
    }
    // listToArray：把类数组转数组
    function listToArray(arg){
        if(flag){
            return Array.prototype.slice.call(arg)
        }
        var ary=[];
        for(var i=0;i<arg.length;i++){
            ary.push(arg[i])
        }
        return ary
    }
    //jsonParse：把JSON格式的字符串转成JSON格式的数据
    function jsonParse(str){
        return 'JSON' in window?JSON.parse(str):eval('('+str+')')
    }
    //win：处理（获取，设置）浏览器盒子模型的兼容性
    function win(attr,value){
        if(typeof value==='undefined'){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value
    }
    //getCss：获取那个元素经浏览器计算过的样式（获取非行间样式）
    function getCss(curEle,attr) {
        var val, reg;
        if (flag) {
            val = getComputedStyle(curEle, false)[attr]
        } else {
            if (attr === 'opacity') {//当用户传opacity在低级浏览器下实际获取的是filter的值
                val = curEle.currentStyle['filter'];//拿到的是alpha(opacity=10)
                reg = /^alpha\(opacity[=:](\d+)\)$/gi;
                return reg.test(val) ? RegExp.$1 / 100 : 1
                //如果全局不用g那么return 就是return reg.test(val) ? reg.exec(val)[1] / 100 : 1

            } else {
                val = curEle.currentStyle[attr]
            }
        }
        reg = /^([+-])?\d+(\.\d+)?(px|pt|rem|em)$/g;//(可以不写g)
        return reg.test(val) ? parseFloat(val) : val
    }
    //：当前元素到body的距离：{left：l；top:t}
    function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(navigator.userAgent.indexOf('MSIE 8')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent
        }
        return{left:l,top:t}
    }
    //getByClass:在一定的范围通过class名获取元素
    function getByClass(curEle,strClass){
        curEle=curEle||document;
        //返回值是个数组
        //高级浏览器和低级浏览器的判断
        if(flag){//高级浏览器
            return this.listToArray(curEle.getElementsByClassName(strClass))
        }
        //低级浏览器的兼容处理
        //把传进来的strClass切割成数组：1）去除首尾空格 2）通过正则（若干个空格）切成数组
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        //获取当前元素下的所有节点
        var nodeList=curEle.getElementsByTagName('*');
        var ary=[]//保存以后取到的合格的标签
        //遍历元素中的每一项，如果当前元素的className都包含我们aryClass中的每一项，那么，这个元素就是合格的，把它放入数组ary中，整个循环结束，返回数组
        for(var i=0;i<nodeList.length;i++){
            var curNode=nodeList[i];
            var bOk=true;
            for(var k=0;k<aryClass.length;k++){
                var curClass=aryClass[k];
                var reg=new RegExp('(^| +)'+curClass+'( +|$)');
                if(!reg.test(curNode.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary[ary.length]=curNode
            }
        }
        return ary
    }
    //hasClass：验证这个元素上，是否有class名
    function hasClass(curEle,cName){
        cName=cName.replace(/(^ +)|( +$)/g,'')
        var reg=new RegExp('\\b'+cName+'\\b');
        return reg.test(curEle.className)
    }
    //addClass：如果元素身上没有这个class名，再给元素身上添加样式,没有返回值，因为我们是设置
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s/g);
        for(var i=0;i<aryClass.length;i++){
            var curClass=aryClass[i];
            if(!this.hasClass(curEle,curClass)){
                curEle.className+=' '+curClass;
            }
        }
    }

    //removeClass:如果元素身上有这个class名，才能删除
    function removeClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0;i<aryClass.length;i++){
            var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)');
            //var reg=new RegExp('\\b'+aryClass[i]+'\\b');现在不可用
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ')
            }
        }
    }
    //setCss:设置样式 透明度 单位
    function setCss(curEle,attr,value){
        if(attr==='float'){
            curEle.style.styleFloat=value;
            curEle.style.cssFloat=value;
        }
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+value*100+')';
            return;
        }
        var reg=/(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))/;
        if(reg.test(attr)){
            value=parseFloat(value)+'px'
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,options){
        for(var attr in options){
            this.setCss(curEle,attr,options[attr]);
        }
    }
    //css：取值赋值合体的函数：getCss,SetCss，setGroupCss
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==='string'){
            var arg3=arguments[2];
            if(typeof arg3==='undefined'){
                return this.getCss(curEle,arg2)
            }else{
                this.setCss(curEle,arg2,arg3)
            }
        }
    if(arg2.toString()==='[object Object]'){//说明第二个参数是个对象
        this.setGroupCss(curEle,arg2);
    }
    /*if(arg2 instanceof Object){

     this.setGroupCss(curEle,arg2);
     }
     if(arg2.constructor.name==='Object'){
     console.dir(arg2.constructor)
     this.setGroupCss(curEle,arg2);
     }*/
}

    //getChildren:获取当前元素下的所有子元素
    function getChildren(curEle){
        if('getComputedStyle' in window){
            return Array.prototype.slice.call(curEle.children)
        }
        var ary=[];
        //获取当前元素下所有的子节点：文本节点，注释节点，元素节点，document节点(主要是获取元素节点)
        var nodeList=curEle.childNodes;
        for(var i=0;i<nodeList.length;i++){
            if(nodeList[i].nodeType===1){
                ary[ary.length]=nodeList[i]
            }
        }
        return ary
    }
    //prev：获取上一个哥哥元素节点
    function prev(curEle){
        if(flag){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre&&pre.nodeType!==1){
            pre=pre.previousSibling
        }
        return pre;
    }
    //prevAll:获取所有的哥哥元素节点
    /*参数：1个 ：curEle
     * 返回值，数组
     * 思路：
     * 先获取上一个哥哥元素节点
     * 判断条件：只要哥哥元素节点存在，就继续在往上找
     *找到一个，给数组中添加一个，不知道要找多少次，用while循环
     * */
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[]
        while(pre){
            ary.unshift(pre)
            pre=this.prev(pre)
        }
        return ary;
    }
    //next:下一个弟弟元素节点
    /*
     * 参数：1个：curEle
     * 返回值：1个：下一个弟弟元素节点
     *1）高级浏览器中flag判断，通过nextiousSibling
     * 2）低级浏览器：while（nex&&nex.nodeType！==1）{}
     * */
    function next(curEle){
        if(flag){
            return curEle.nextElementSibling
        }
        var nex=curEle.nextSibling;
        while(nex&&nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    //next:获取所有的弟弟元素节点
    /*参数：1个 ：curEle
     * 返回值，数组
     * 思路：
     * 先获取上一个弟弟元素节点
     * 判断条件：只要弟弟元素节点存在，就继续在往上找
     *找到一个，给数组中添加一个，不知道要找多少次，用while循环
     * */
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.unshift(nex);
            nex=this.next(nex)
        }
        return ary;
    }
    //sibling:获取当前元素的相邻元素：上一个哥哥元素节点和下一个弟弟元素节
    /*返回值：数组
     *参数：1个：当前元素curEle;
     * 哥哥存在，放进数组，弟弟存在放进数组
     * */
    function sibling(curEle){
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        var ary=[];
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary
        //pre?ary.push(pre):null;

    }
    //siblings:获取当前元素的所有兄弟节点：所有的哥哥元素节点和所有的弟弟元素节
    /*返回值：数组
     *参数：1个：当前元素curEle;
     * 思路：所有的哥哥元素节点和所有的弟弟元素节==》数组拼接concat
     * */
    function siblings(curEle){
        return this.prevAll(curEle).concat(this.nextAll(curEle))
    }
    // firstChild 当前元素下的第一个子元素
    /* *返回值：第一个子元素
     *参数：1个：当前元素curEle;
     * 思路：可以拿到但前元素的所有子元素  数组
     * 我们要拿的是数组的第一项
     * */
    function firstChild(curEle){
        return this.getChildren(curEle)[0]
    }
    // lastChild 当前元素下的最后一个子元素
    function lastChild(curEle){
        var aChs=this.getChildren(curEle);
        return aChs[aChs.length-1]
    }
    // index :获取当前元素的索引，
    /*参数：1个：当前元素curEle
     * 思路：就是当前哥哥的个数
     * */
    function index(curEle){
        return this.prevAll(curEle).length
    }
    function appendChild(newEle,oldEle){//兼容的，所有也可以不用写
        oldEle.parentNode.appendChild(newEle);
    }
    //appendChild:function(parent,newEle){
    //    parent.appendChild(newEle);
    //}

    //prependChild  把新元素插入到当前容器的最开始
    /*
     * 父级里有没有其他元素
     *
     * */
    function prependChild(parent,newEle){
        /*  var aChs=this.getChildren(parent);

         //如果有子元素，插到第一个子元素的前面
         if(aChs.length){
         var first=this.firstChild(parent);
         parent.insertBefore(newEle,first)
         }else{
         //第一个子元素不存在，就插入到最后面
         parent.appendChild(newEle)
         }*/
        var first=this.firstChild(parent);
        //if(first){
        //    parent.insertBefore(newEle,first)
        //}else{
        //    parent.appendChild(newEle)
        //}
        first? parent.insertBefore(newEle,first):parent.appendChild(newEle)
    }
    //insertBefore：
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle)
    }
    //把新元素插入到指定元素的弟弟元素的前面
    function insertAfter(newEle,oldEle){
        //获取指定元素的弟弟元素
        var nex=this.next(oldEle);
        //如果指定元素的弟弟元素节点存在的话，把新元素插入弟弟元素前面
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex)
        }else{
            //如果指定元素的弟弟元素节点不存在，直接插入父容器的末尾
            oldEle.parentNode.appendChild(newEle);
        }
    }

    return{
       rnd:rnd,
        listToArray:listToArray,
        jsonParse:jsonParse,
        win:win,
        getCss:getCss,
        offset:offset,
        getByClass:getByClass,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        setCss:setCss,
        setGroupCss:setGroupCss,
        css:css,
        getChildren:getChildren,
        prev:prev,
        prevAll:prevAll,
        next:next,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        firstChild:firstChild,
        lastChild:lastChild,
        index:index,
        appendChild:appendChild,
        prependChild:prependChild,
        insertBefore:insertBefore,
        insertAfterr:insertAfter


}
})();