const sessions = require('./sessions');
const bcrypt = require('bcrypt');
const db = require('./database');

function createSession(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return failure(req, res, "Account not found.  Please try again.");
    bcrypt.compare(password, user.cryptedPassword, (err, result) => {
        if (err) return serveError(req, res, 500, err);
        if (result) {
            var sid = sessions.create(user);
            var info = db.prepare('INSERT INTO sessions (sid) VALUES (?)').run(sid);
            if (info.changes === 1) success(req, res);
            else failure(req, res, "Error: Couldn't create session. Please try again later.");
        }
        else return failure(req, res, "Account not found. Please try again.");
    });
}

function failure(req, res, errorMessage) {
    if (!errorMessage) errorMessage = "There was an error processing your request.  Please try again."
    res.statusCode = 302;
    res.setHeader("Location", "/signin");
    res.end();
}

function success(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "/forum");
    res.end();
}

module.exports = createSession;
