function serveError(req, res, status, err) {
    console.error(`Error occurred with request ${req.method} ${req.url}`);
    console.error(err);
    console.trace();
    res.writeHead(status).end();
    return;
}

module.exports = serveError;