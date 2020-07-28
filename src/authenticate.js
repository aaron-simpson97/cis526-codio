const { response } = require("./app");

function authenticate(req, res, next) {
    if (!req.session) {
        res.writeHead(302, { Location: "/signin" });
        return res.end();
    }
    next();
}

module.exports = authenticate;