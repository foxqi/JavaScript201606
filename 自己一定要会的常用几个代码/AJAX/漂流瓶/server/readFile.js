/**
 * Created by ���� on 2016/7/30.
 */
var fs = require('fs'); // file stream


/**
 * ��ȡ�ļ�
 * @param path ·����Ϣ
 * @param response http��Ӧ
 */
var readFile = function (path, response) {
    // ��ʽ���ļ�·��,�Ѹ�Ŀ¼��ʶȥ��
    path = '..' + path;
    // ����ļ��Ƿ����
    fs.exists(path, function (isExists) {
        if (isExists) {
            // ��ȡ�ļ�
            fs.readFile(path, function (err, data) {
                // �ж϶�ȡ�ļ��Ƿ�ʧ��
                if (err) {
                    // �������ڲ�����
                    response.writeHead(500);
                    response.end('server internal error')
                } else {
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

module.exports = readFile;