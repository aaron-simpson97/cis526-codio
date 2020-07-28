var sessions = {};
const { v1: uuidv1 } = require('uuid');
const db = require('./database');
const e = require('express');
const SESSION_MAX_DURATION = 3 * 60 * 1000;
const SESSION_EXPIRATION_INTERVAL = 60 * 60 * 1000;

function generateUUID() {
    var uuid = uuidv1();
    while (sessions[uuid]) {
        uuid = uuidv1()
    }
    return uuid;
}

function createSession(user) {
    var sid = generateUUID();
    var role = db.prepare("SELECT name FROM roles WHERE id = ?").get(user.role_id);
    sessions[sid] = {
        timestamp: Date.now(),
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            organization: user.organization,
            role: role
        },
        data: {}
    }
    return sid;
}

function isSessionExpired(sid) {
    if (!sessions[sid]) return true;
    var expired = Date.now() - sessions[sid].timestamp > SESSION_MAX_DURATION;
    if (expired) {
        delete sessions[sid];
        return true;
    } else {
        return false;
    }
}

function expireSessions() {
    for (const sid in sessions) {
        isSessionExpired(sid);
    }
}

function getSession(sid) {
    if (sessions[sid] && !isSessionExpired(sid)) {
        sessions[sid].timestamp = Date.now();
        return JSON.parse(JSON.stringify(sessions[sid]));
    } else {
        return false;
    }
}

function updateSession(sid, data) {
    if (sessions[sid] && !isSessionExpired(sid)) {
        sessions[sid].timestamp = Date.now();
        sessions[sid].data = data;
        return true;
    } else {
        return false;
    }
}

function removeSession(sid) {
    delete sessions[sid];
}

setInterval(expireSessions, SESSION_EXPIRATION_INTERVAL);

module.exports = {
    sessions: sessions,
    create: createSession,
    get: getSession,
    update: updateSession,
    remove: removeSession
}