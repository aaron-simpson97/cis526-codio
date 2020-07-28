const templates = require('./templates');
const topics = require('./topics')

function serveForum(req, res) {
    const html = templates['forum']({
        user: req.session && req.session.user,
        topics: topics.getAll()
    });
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveForum;

