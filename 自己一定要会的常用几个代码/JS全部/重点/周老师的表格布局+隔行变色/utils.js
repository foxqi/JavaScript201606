/**
 * Created by Administrator on 2016/6/20 0020.
 */
//utils这个库:主要提供一些公有的工具方法
    var utils= {
    //-》listToArray：实现将类数组转换为数组
    /**
     * listToArray:Class Array
     * @param likeAry
     * @returns {Array}
     */
    listToArray:function(likeAry){
        var ary=[];
        try{
            ary=Array.prototype.slice.call(likeAry);
        }catch(e){
            for(var i=0;i<likeAry.length;i++){
                ary[ary.length]=likeAry[i]
            }
        }
        return ary;
    },
    jsonParse: function (str) {
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    }
}