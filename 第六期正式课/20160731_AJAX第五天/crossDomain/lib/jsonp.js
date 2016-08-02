/**
 * Created by 银鹏 on 2016/7/31.
 */
(function () {
    // 解决低版本ie下 undefined被重写的bug
    var undefined = void 0;

    /**
     * jsonp逻辑
     * @param url jsonp接口
     * @param data 参数
     * @param jsonpcallback jsonpcallback
     * @param callback 回调函数
     */
    window.jsonp = function (url, data, jsonpcallback, callback) {
        // 每次累加 防止缓存
        // 因为jsonp是get请求,而get请求容易被缓存,所以这里每次累加用来防止缓存
        var cbName = 'cb' + counter++;

        // 1 生成一个全局函数名
        // 在jsonpcallback后面使用
        var globalFunctionName = 'window.jsonp.' + cbName;

        // 2 生成一个全局函数体
        window.jsonp[cbName] = function (data) {
            try {
                callback(data);
            } finally {
                removeScript();
            }
        };

        // 3 将data格式化为querystring
        data = tools.encodeData2URIString(data);

        // 4 将data拼接到url上
        url = tools.padStringToURL(url, data);

        // 5 将jsonpcallback拼接到url中
        url = tools.padStringToURL(url, jsonpcallback + '=' + globalFunctionName);

        // 6 动态生成script标签
        var script = document.createElement('script');
        script.async = 'async';
        script.src = url;

        // 7 将script添加到body中
        var complete = function () {
            document.body.appendChild(script);
        };

        // 加载完成之后,删除script标签
        function removeScript() {
            script.parentNode.removeChild(script);
            delete  window.jsonp[cbName];
        }

        // 判断dom树是否加载完成
        if (document.readyState === 'complete') {
            complete();
        } else {
            if (window.addEventListener) {
                window.addEventListener('load', function () {
                    complete();
                }, false);
            } else {
                window.attachEvent('onload', function () {
                    complete();
                });
            }
        }
    };

    var counter = 1;


    var tools = {
        padStringToURL: function (url, padString) {
            padString = tools.encodeData2URIString(padString);
            if (!padString) {
                return url;
            }
            var hasSearch = /\?/.test(url);
            return url + (hasSearch ? '&' : '?') + padString;

        },
        encodeData2URIString: function (data) {
            if (tools.isType(data, 'Undefined') || tools.isType(data, 'Null')) {
                return '';
            }
            if (tools.isType(data, 'String')) {
                return data;
            }
            if (tools.isType(data, 'Object')) {
                var arr = [];
                for (var n in data) {
                    if (!data.hasOwnProperty(n)) continue;
                    arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
                }
                return arr.join('&')
            }
            return data.toString();

        },
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        }
    };
})();