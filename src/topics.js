const db = require('./database');

function success(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "/forum");
    res.end();
}

function failure(req, res, errorMessage) {
    if (!errorMessage) errorMessage = "There was an error processing your request. Please try again."
    console.log(errorMessage);
    res.statusCode = 302;
    res.setHeader("Location", "/forum");
    res.end();
}

function getATopic(req, res) {
    var topic = db.prepare('SELECT * FROM forum_topics WHERE id=? ORDER BY forum_topics.created_at DESC;').get(req.params.id);
    return topic;
}

function getAllTopics() {
    var topics = db.prepare(`SELECT forum_topics.id, subject, firstname, lastname, created_at
        FROM forum_topics 
        INNER JOIN users ON forum_topics.user_id = users.id
        ORDER BY forum_topics.created_at DESC;`).all();
    return topics;
}

function createTopic(req, res) {
    var user_id = req.body.user;
    var subject = req.body.subject;
    var createdAt = Date.now();
    var info = db.prepare("INSERT INTO forum_topics (subject, user_id, created_at) VALUES (?, ?, ?);").run(subject, user_id, createdAt);
    if (info.changes === 1) success(req, res);
    else failure(req, res, "An error occurred. Please try again.");
}

module.exports = {
    create: createTopic,
    get: getATopic,
    getAll: getAllTopics,
};