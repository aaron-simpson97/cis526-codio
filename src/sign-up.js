const templates = require('./templates');

function serveSignUp(req, res) {
    const html = templates['signup']({});
    res.setHeader("Content-Length", html.length);
    res.setHeader("Content-Type", 'text/html');
    res.end(html);
}

module.exports = serveSignUp;

