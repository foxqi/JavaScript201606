/**
 * Created by ���� on 2016/7/30.
 */
// 1 ���������a.js
// 2 �������յ�a.js������,��У�������ײ����Ƿ���if-modified-since����if-none-match
// 3 ������������ײ��е��κ�һ��,����������ϵ�a.js��У��
// 4 ���У��ɹ� ���� 304 ,���򷵻�200 ����������Ӧ�ײ�last-modified��etag

// ��ȡhttpģ�� ��������http������
var http = require('http');
// ��ȡ�ļ�����ģ��
var fs = require('fs'); // file stream
var url = require('url');// ����urlΪһ������

/**
 * ��ȡ�ļ�
 * @param path ·����Ϣ
 * @param response http��Ӧ
 */
var readFile = function (path, headers, response) {
    // ��ʽ���ļ�·��,�Ѹ�Ŀ¼��ʶȥ��
    path = path.slice(1);
    // ����ļ��Ƿ����
    fs.exists(path, function (isExists) {
        if (isExists) {
            var since = null;
            var mtime = fs.statSync(path).mtime;
            if (since = headers['if-modified-since']) {
                if (since === mtime) {
                    response.writeHead(304);
                    return;
                }
            }

            // ��ȡ�ļ�
            fs.readFile(path, function (err, data) {
                // �ж϶�ȡ�ļ��Ƿ�ʧ��
                if (err) {
                    // �������ڲ�����
                    response.writeHead(500);
                    response.end('server internal error')
                } else {
                    // �ɹ�, ����200
                    console.log(mtime);

                    response.end(data);
                }
            });
        } else {
            // �ļ������� ����404
            response.writeHead(404);
            response.end('file not found')
        }
    });
};
// ����httpģ�� ����http������ �ص��������������� ��һ������Ϊhttp���� �ڶ�������Ϊhttp��Ӧ
var server = http.createServer(function (request, response) {
    // �������url��ʽ��Ϊһ������,�������
    var query = url.parse(request.url, true);

    // ��������·�� �����ļ�
    readFile(query.pathname, request.headers, response);
});
// �˿��������Ϊ65535 �����˿�
server.listen(12345, function () {
    console.log('server start over');
});
