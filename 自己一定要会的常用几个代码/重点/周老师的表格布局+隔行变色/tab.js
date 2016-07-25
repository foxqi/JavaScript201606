/**
 * Created by Administrator on 2016/6/21 0021.
 */
//想要操作谁就先获取谁
var oTab=document.getElementById('tab');
var tHead=oTab.tHead;
var oThs=tHead.rows[0].cells;
var tBody=oTab.tBodies[0];
var oRows=tBody.rows;

var data=null
//-》1首先获取后台（data.txt）中的数据“JSON格式的字符串”->Ajax(async javascript and xml)
//1)首先创建一个Ajax对象
var xhr=new  XMLHttpRequest;
//2)打开我们需要请求数据的那个文件地址
xhr.open('get','data.txt',false);
//3)监听请求状态
xhr.onreadystatechange=function(){
    if(xhr.readyState===4&&/^2\d{2}$/.test(xhr.status)){
       var val=xhr.responseText;
        data=utils.jsonParse(val)

    }
};
//4)发送请求
xhr.send(null)


//-》2.实现我们的数据绑定
function bind(){
    var  frg=document.createDocumentFragment();
    for(var i=0;i<data.length;i++){
        var cur=data[i];
        var oTr=document.createElement('tr');//每一次循环创建一个tr，每一个tr中还需要创建4个td，以为每一个对象中有四组键值对
        for(var key in cur){
            var oTd=document.createElement('td');
            //对性别进行特殊处理
            if(key==='sex'){
                oTd.innerHTML=cur[key]===0?'男':'女';
            }else{oTd.innerHTML=cur[key];}

            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
     frg=null;

}
bind()
//实现隔行变色
function changBg(){
    for(var i=0;i<oRows.length;i++){
        oRows[i].className="bg"+i%2
    }
}
changBg();


//->4.编写表格排序的方法:实现按照年龄这一列进行排序
function sort(n){//n是当前点击这一列的索引
    var _this=this;

    //->把存储所有行的类数组转为数组
    var ary=utils.listToArray(oRows);
//给数组进行排序：按照每一行的第二列中的内容有小到大进行排序
    //点击当前列，需要让其他的列的flag存储的值回归到初始值-1，这样在返回头点击其他的列，才是按照升序排列的
    for(var k=0;k<oThs.length;k++){
        if(oThs[k] !==this){
            oThs[k].flag=-1;
        }
    }

    _this.flag*=-1;//-》每一次执行sort，进来的第一步就是先让flag的值*-1-》第一次flag=-1*=-1
    ary.sort(function(a,b){
var curInn=a.cells[n].innerHTML;
var nexInn=b.cells[n].innerHTML;
var curInnNum=parseFloat(a.cells[n].innerHTML);
var nexInnNum=parseFloat(b.cells[n].innerHTML);
if(isNaN(curInnNum)||isNaN(nexInnNum)){
    return (curInn.localeCompare(nexInn))*_this.flag;
}
      return  (curInn-nexInnNum)*_this.flag;
    });
    //按照ary中的最新顺序，把每一行重新的添加到tBody中
var frg=document.createDocumentFragment();
    for(var i=0;i<ary.length;i++){
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg=null;
    //-》按照最新的顺序重写进行隔行变色
    changBg()

}
//-5.点击排序:s所有具有class=‘’这个样式的列
for(var i=0;i<oThs.length;i++){
    var curTh=oThs[i];
    if(curTh.className==='cursor'){
        curTh.index=i;//用来存储索引的
        curTh.flag=-1;//用来实现升降序的
        curTh.onclick=function(){
            sort.call(this,this.index)
        }
    }

}
//oThs[1].flag=-1;//给当前点击这一列增加一个自定义属性flag，存储的值是1
//oThs[1].onclick=function(){
//    //sort();
//    //sort.call(oThs[1])
//    sort.call(this)
//}



























