const templates = require('./templates');
const db = require('./database');

function serveNewTopic(req, res) {
    const html = templates['new-topic']({
        user: req.session && req.session.user
    });
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveNewTopic;

