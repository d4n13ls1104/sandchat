const db = require("../util/sand-db"); // DB Related functions
const mysql = require("mysql");

// Purpose: Check if email is valid
function isEmailValid(str) {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(str.toLowerCase());
}

// Purpose: Check if username is valid
function isUsernameValid(str) {
    return (/^[a-zA-Z0-9\_]+$/).test(str);
}

// Purpose: Check if password meets our password standards
function isPasswordValid(str) {
    return (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/).test(str);
}

// Purpose: Check if email is already registered
function isEmailRegistered(str, callback) {
    var connection = db.getDBConnection();
    connection.query(`SELECT 1 FROM users WHERE email=${mysql.escape(str)}`, (err, result) => {
        if(err) console.log(err);
        if(result.length > 0) { callback(true); } else { callback(false); }
    });
    connection.end();
}

// Purpose: Check if username is already registered
function isUsernameRegistered(str, callback) {
    var connection = db.getDBConnection();
    connection.query(`SELECT 1 FROM users WHERE username=${mysql.escape(str)}`, (err, result) => {
        if(err) console.log(err);
        if(result.length > 0) { callback(true); } else { callback(false); }
    });
    connection.end();
}

module.exports = {
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
    isEmailRegistered,
    isUsernameRegistered
};