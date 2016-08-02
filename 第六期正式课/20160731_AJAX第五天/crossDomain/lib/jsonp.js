/**
 * Created by ���� on 2016/7/31.
 */
(function () {
    // ����Ͱ汾ie�� undefined����д��bug
    var undefined = void 0;

    /**
     * jsonp�߼�
     * @param url jsonp�ӿ�
     * @param data ����
     * @param jsonpcallback jsonpcallback
     * @param callback �ص�����
     */
    window.jsonp = function (url, data, jsonpcallback, callback) {
        // ÿ���ۼ� ��ֹ����
        // ��Ϊjsonp��get����,��get�������ױ�����,��������ÿ���ۼ�������ֹ����
        var cbName = 'cb' + counter++;

        // 1 ����һ��ȫ�ֺ�����
        // ��jsonpcallback����ʹ��
        var globalFunctionName = 'window.jsonp.' + cbName;

        // 2 ����һ��ȫ�ֺ�����
        window.jsonp[cbName] = function (data) {
            try {
                callback(data);
            } finally {
                removeScript();
            }
        };

        // 3 ��data��ʽ��Ϊquerystring
        data = tools.encodeData2URIString(data);

        // 4 ��dataƴ�ӵ�url��
        url = tools.padStringToURL(url, data);

        // 5 ��jsonpcallbackƴ�ӵ�url��
        url = tools.padStringToURL(url, jsonpcallback + '=' + globalFunctionName);

        // 6 ��̬����script��ǩ
        var script = document.createElement('script');
        script.async = 'async';
        script.src = url;

        // 7 ��script��ӵ�body��
        var complete = function () {
            document.body.appendChild(script);
        };

        // �������֮��,ɾ��script��ǩ
        function removeScript() {
            script.parentNode.removeChild(script);
            delete  window.jsonp[cbName];
        }

        // �ж�dom���Ƿ�������
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