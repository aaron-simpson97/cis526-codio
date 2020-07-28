const bcrypt = require('bcrypt');
const db = require('./database');
const sessions = require('./sessions');

function success(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "/forum");
    res.end();
}

function failure(req, res, errorMessage) {
    if (!errorMessage) errorMessage = "There was an error processing your request. Please try again."
    console.log(errorMessage);
    res.statusCode = 302;
    res.setHeader("Location", "/signin");
    res.end();
}

function createUser(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var organization = req.body.organization;
    var role_id = db.prepare('SELECT id FROM roles WHERE name = ?').get(req.body.roles);
    var email = req.body.email;
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;
    if (password !== passwordConfirmation) return failure(req, res, "Your password and password confirmation must match.");
    var existingEmail = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingEmail) return failure(req, res, `An account already exists with email "${email}"`);
    const passes = 10;
    bcrypt.hash(password, passes, (err, cryptedPassword) => {
        if (err) return serveError(req, res, 500, err);
        var info = db.prepare("INSERT INTO users (firstname, lastname, organization, role_id, email, cryptedPassword) values (?, ?, ?, ?, ?, ?);").run(firstname, lastname, organization, role_id.id, email, cryptedPassword);
        if (info.changes === 1) {
            var user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
            var sid = sessions.create(user);
            info = db.prepare('INSERT INTO sessions (sid) VALUES (?)').run(sid);
            if (info.changes === 1) success(req, res);
            else failure(req, res, "Error: Couldn't create session. Please try again later.");
        }
        else failure(req, res, "An error occurred. Please try again.");
    });

}

module.exports = createUser;