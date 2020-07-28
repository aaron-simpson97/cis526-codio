const sessions = require('./sessions');
const db = require('./database');

function loadSession(req, res, next) {
    var sessionID = db.prepare("SELECT sid FROM sessions WHERE isValid=0 ORDER BY id DESC LIMIT 1;").get();
    if (sessionID) {
        var currentSession = sessions.get(sessionID.sid);
        req.session = currentSession;
        next();
    } else {
        req.session = null;
        next();
    }
}

module.exports = loadSession;