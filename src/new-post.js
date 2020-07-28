const templates = require('./templates');
const topics = require('./topics');

function serveNewPost(req, res) {
    const html = templates['new-post']({
        user: req.session && req.session.user,
        topic: topics.get(req, res)
    });
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveNewPost;

