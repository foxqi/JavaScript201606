/**
 * Created by ���� on 2016/7/30.
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
    var ajax = function (options) {
        // �жϲ����Ƿ�Ϸ�
        if (!tools.isType(options, 'Object')) {
            throw new TypeError('�������ʹ���');
        }
        // ��ȡajax����
        var xhr = tools.getXHR();

        // ��ʽ������
        options.data = tools.encodeData2URIString(options.data);

        // �����getϵ���� ���dataƴ�ӵ�url��querystring��
        if (/^get|delete|head$/ig.test(options.method)) {
            options.url = tools.padStringToURL(options.url, options.data);
            // ��options.data���
            options.data = null;
        }
        // ������
        if (options.cache === false) {
            // ��λ�� | �߼��� ||
            // �����ɫ "#"+(Math.random()*0xffffff|0).toString(16)
            var random = Math.random().toString(36).slice(2);
            options.url = tools.padStringToURL(options.url, random);
        }

        // ajax�ڶ���
        xhr.open(options.method, options.url, options.async);

        // �Զ��������ײ�
        if (tools.isType(options.headers, 'Object') && xhr.setRequestHeader) {
            for (var n in options.headers) {
                if (!options.headers.hasOwnProperty(n)) continue;
                xhr.setRequestHeader(n, options.headers[n]);
            }
        }
        // ��ȡ��Ӧ����
        xhr.onreadystatechange = function () {
            // �ж�http���� �Ƿ����
            if (xhr.readyState === 4) {
                // �ж�״̬��
                if (/^2\d{2}$/.test(xhr.status) || xhr.status === 304) {
                    // ��ȡ��Ӧ����
                    var response = xhr.responseText;
                    // �Ƿ���Ҫ����Ӧ�����ʽ��Ϊjson����
                    if (/^json$/ig.test(options.dataType)) {
                        // Ϊ�˷�ֹ���Ϸ���json�ַ�������parse����
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
        // ����ajax����
        xhr.send(options.data);
    };

    /**
     * ��������
     * @type {{isType: Function, getXHR, encodeData2URIString: Function, padStringToURL: Function, JSONParse: Function}}
     */
    var tools = {
            /**
             * �����������
             * @param data
             * @param type
             * @return {boolean}
             */
            isType: function (data, type) {
                return Object.prototype.toString.call(data) === '[object ' + type + ']';
            },
            /**
             * ��ȡajax����
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
                    throw new ReferenceError('��ǰ�������֧��ajax����')
                }

                return xhr;
            })(),
            /**
             * �������ʽ��Ϊquerystring��ʽ
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
             * ��url��ƴ���ַ���
             * @param {string} url ��ַ
             * @param {*} padString ��ƴ�ӵ�����
             * @return {string}  ƴ����ɵ�url
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
             * ��json�ַ�����ʽ��Ϊjson����
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
        ;
    this.ajax = ajax;
})();