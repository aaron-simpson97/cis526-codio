const templates = require('./templates');
const topics = require('./topics');
const posts = require('./posts');

function serveTopicPage(req, res) {
    const html = templates['topic']({
        user: req.session && req.session.user,
        topics: topics.getAll(),
        topic: topics.get(req, res),
        posts: posts.get(req, res)
    });
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveTopicPage;

