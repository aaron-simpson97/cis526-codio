const Database = require('better-sqlite3');
module.exports = new Database('./database/session_store.db');