const querystring = require('querystring');
const serveError = require('./serve-error');

function loadBody(req, res, next) {
    var chunks = [];
    req.on('data', (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        var data = Buffer.concat(chunks);
        var encoding = req.headers['content-type'];
        switch (encoding.split(';')[0]) {
            case 'application/x-www-form-urlencoded':
                req.body = querystring.parse(data.toString());
                next();
                break;
            case 'multipart/form-data':
                try {
                    var match = /boundary=(.+)$/.exec(req.headers["content-type"]);
                    var boundary = match[1];
                    req.body = parseMultipart(data, boundary);
                    next();
                } catch (err) {
                    serveError(req, res, 422, err);
                }
                break;
            case 'text/plain':
                req.body = data.toString();
                next();
                break;
            case 'application/json':
                try {
                    req.body = JSON.parse(data.toString());
                    next();
                } catch (err) {
                    serveError(req, res, 400, err);
                }
                break
            default:
                serveError(req, res, 501, `Body Content-Type ${encoding} not supported`);
        }
    });
    req.on('error', (err) => {
        serveError(req, res, 400, err);
    });
}

module.exports = loadBody;

function splitContentParts(buffer, boundary) {
    var parts = [];
    var boundaryBytes = '--' + boundary;
    var start = buffer.indexOf(boundaryBytes) + boundaryBytes.length;
    var end = buffer.indexOf(boundaryBytes, start);
    while (end != -1) {
        parts.push(buffer.slice(start, end - 2));
        start = end + boundaryBytes.length;
        end = buffer.indexOf(boundaryBytes, start);
    }
    return parts;
}

function parseContentPart(contentBuffer) {
    const separator = Buffer.from([0x0D, 0x0A, 0x0D, 0x0A]);
    var index = contentBuffer.indexOf(separator);
    var head = contentBuffer.slice(0, index).toString();
    var body = contentBuffer.slice(index + 4);
    var nameMatch = /name="([^"]+)"/.exec(head);
    var filenameMatch = /filename="([^"]+)"/.exec(head);
    if (filenameMatch) {
        var contentTypeMatch = /Content-Type:\s?(\S+)/.exec(head);
        var contentType = contentTypeMatch && contentTypeMatch[1] ? contentTypeMatch[1] : 'application/octet-stream'
        return {
            [nameMatch[1]]: {
                filename: filenameMatch[1],
                contentType: contentTypeMatch[1],
                data: body
            }
        };
    } else {
        return { [nameMatch[1]]: body.toString() };
    }
}

function parseMultipart(buffer, boundary) {
    var body = {};
    var partBuffers = splitContentParts(buffer, boundary);
    partBuffers.forEach(partBuffer => {
        var inputData = parseContentPart(partBuffer);
        Object.assign(body, inputData);
    });
    return body;
}