/**
 * Created by 银鹏 on 2016/7/30.
 */
(function () {
    //{
    //    url: '',
    //    data: '',
    //    method: 'get',
    //    async: true,
    //    dataType: 'text',
    //    success: function () {
    //
    //    },
    //    error: function () {
    //
    //    }
    //}
    /**
     * 操作ajax
     * @param options
     */
    var ajax = function (options) {
        // 判断参数是否合法
        if (!tools.isType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }

        tools.isType(options.method, 'Undefined') && (options.method = 'get');

        // 获取ajax对象
        var xhr = tools.getXHR();

        // 格式化参数 把参数格式化为querystring
        options.data = tools.encodeData2URIString(options.data);

        // 如果是get系方法 则把data拼接到url的querystring中
        if (/^get|delete|head$/ig.test(options.method)) {
            options.url = tools.padStringToURL(options.url, options.data);
            // 把options.data清空
            options.data = null;
        }
        // 处理缓存
        if (options.cache === false) {
            // 按位或 | 逻辑或 ||
            // 随机颜色 "#"+(Math.random()*0xffffff|0).toString(16)
            var random = Math.random().toString(36).slice(2);
            options.url = tools.padStringToURL(options.url, random);
        }

        // ajax第二步
        xhr.open(options.method, options.url, options.async);

        // 自定义请求首部
        if (tools.isType(options.headers, 'Object') && xhr.setRequestHeader) {
            for (var n in options.headers) {
                if (!options.headers.hasOwnProperty(n)) continue;
                xhr.setRequestHeader(n, options.headers[n]);
            }
        }
        // 获取响应主体
        xhr.onreadystatechange = function () {
            // 判断http事务 是否完成
            if (xhr.readyState === 4) {
                // 判断状态码
                if (/^2\d{2}$/.test(xhr.status) || xhr.status === 304) {
                    // 获取响应主体
                    var response = xhr.responseText;
                    // 是否需要将响应主体格式化为json对象
                    if (/^json$/ig.test(options.dataType)) {
                        // 为了防止不合法的json字符串进行parse报错
                        try {
                            response = tools.JSONParse(response)
                        } catch (ex) {
                            options.error(ex);
                            return;
                        }
                    }
                    options.success(response);
                } else if (/^[45]\d{2}$/.test(xhr.status)) {
                    options.error(xhr.responseText, xhr.status);
                }
            }
        };
        // 发送ajax请求
        xhr.send(options.data);
    };

    /**
     * 帮助函数
     * @type {{isType: Function, getXHR, encodeData2URIString: Function, padStringToURL: Function, JSONParse: Function}}
     */
    var tools = {
        /**
         * 监测数据类型
         * @param data
         * @param type
         * @return {boolean}
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        },
        /**
         * 获取ajax对象
         */
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }];

            var xhr = null;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    break;
                } catch (ex) {
                    xhr = null;
                }
            }

            if (xhr === null) {
                throw new ReferenceError('当前浏览器不支持ajax功能')
            }

            return xhr;
        })(),
        /**
         * 将对象格式化为querystring格式
         * // {a:1.b:2} a=1&b=2
         */
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
                return arr.join('&');
            }
            return data.toString();
        },
        /**
         * 往url中拼接字符串
         * @param {string} url 地址
         * @param {*} padString 待拼接的数据
         * @return {string}  拼接完成的url
         */
        padStringToURL: function (url, padString) {
            padString = tools.encodeData2URIString(padString);
            if (padString) {
                var hasSearch = /\?/.test(url);
                return url + (hasSearch ? '&' : '?') + padString;
            }
            return url;
        },
        /**
         * 将json字符串格式化为json对象
         * @param jsonString
         * @return {Object}
         */
        JSONParse: function (jsonString) {
            if (window.JSON) {
                return JSON.parse(jsonString);
            }
            //return eval('(' + jsonString + ')');
            return (new Function('return ' + jsonString))();
        }
    }

    this.ajax = ajax;
})();