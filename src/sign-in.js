const templates = require('./templates');

function serveSignIn(req, res) {
    const html = templates['signin']({});
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveSignIn;

