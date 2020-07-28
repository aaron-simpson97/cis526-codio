const sessions = require('./sessions');
const db = require('./database');

function destroySession(req, res, next) {
    var sessionID = db.prepare("SELECT sid FROM sessions ORDER BY id DESC LIMIT 1;").get();
    db.prepare('UPDATE sessions SET isValid = 1 WHERE sid = ? ORDER BY id DESC LIMIT 1;').run(sessionID.sid);
    sessions.remove(sessionID.sid);
    res.statusCode = 302;
    res.setHeader("Location", "/forum");
    res.end();
}

module.exports = destroySession;