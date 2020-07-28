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

function getAllPostsForTopic(req, res) {
    var topics = db.prepare(`SELECT title, body, firstname || ' ' || lastname AS author, forum_topics.created_at AS date
        FROM forum_posts 
        INNER JOIN users ON forum_posts.user_id = users.id 
        INNER JOIN forum_topics ON forum_posts.forum_topic_id = forum_topics.id
        WHERE forum_topic_id = ?
        ORDER BY forum_posts.created_at ASC;`).all(req.params.id);
    return topics;
}

function createPost(req, res) {
    var user_id = req.body.user;
    var forum_topic_id = req.body.topic;
    var body = req.body.body;
    var createdAt = Date.now();
    var title = req.body.title;
    var info = db.prepare('INSERT INTO forum_posts(body, title, forum_topic_id, user_id, created_at) VALUES(?,?,?,?,?);').run(body, title, forum_topic_id, user_id, createdAt);
    if (info.changes === 1) success(req, res);
    else failure(req, res, "An error occurred. Please try again.");
}

module.exports = {
    create: createPost,
    get: getAllPostsForTopic
};