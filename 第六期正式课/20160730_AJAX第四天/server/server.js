/**
 * Created by ���� on 2016/7/30.
 */

// ��ȡhttpģ�� ��������http������
var http = require('http');
var querystring = require('querystring');
// ��ȡ�ļ�����ģ��
var url = require('url');// ����urlΪһ������
var readFile = require('./readFile');
var bottleService = require('./bottleService');

// ����httpģ�� ����http������ �ص��������������� ��һ������Ϊhttp���� �ڶ�������Ϊhttp��Ӧ
var server = http.createServer(function (request, response) {
    // �������url��ʽ��Ϊһ������,�������
    var query = url.parse(request.url, true);

    console.log(query);
    if (query.pathname === '/getDriftingBottle') {
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(bottleService.get());
    } else if (query.pathname === '/throwDriftingBottle') {
        var chunk = '';
        request.on('data', function (data) {
            chunk += data;
        });
        request.on('end', function () {
            var obj = querystring.parse(chunk);
            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(bottleService.set({
                content: obj.content,
                date: Date.now()
            }));
        });
    } else {
        // ��������·�� �����ļ�
        readFile(query.pathname, response);
    }
});
// �˿��������Ϊ65535 �����˿�
server.listen(12345, function () {
    console.log('server start over');
});
