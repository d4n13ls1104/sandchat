// NPM MODULES
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

// SAND MODULES
const validator = require("../util/sand-validator");
const db = require("../util/sand-db").pool;
const jwt = require("../util/sand-jwt");

const router = express.Router();


// Purpose: API to return the number of users that are registered.
router.get("/count", (req, res) => {
	db.getConnection((err, connection) => {
		if(err) return res.json({errors: ["Something went wrong. Please try again later."]});
		connection.query("SELECT COUNT(id) AS count FROM users", (err, result) => {
			if(err) return res.json({errors: ["Something went wrong. Please try again later."]});
			return res.json({ count: result[0].count });
		});
		connection.release();
	});
});

// Purpose: Authenticate user (for login)

router.post("/auth", (req, res) => {
    let errors = [];

    const email = req.body.email;
    const password = req.body.password;

    if(!req.body.email) errors.push("Email is required");
    if(!req.body.password) errors.push("Password is required.");
    if(errors.length > 0) return res.json({ errors: errors});


    db.getConnection((err, connection) => {
        if(err) return res.json({ errors: ["Something went wrong. Please try again later."] });

        connection.query(`SELECT id, username, password FROM users WHERE email=${mysql.escape(email)}`, (err, results) => {
           if(err) return res.json({ errors: ["Something went wrong. Please try again later1."] });

            if(results.length == 0) return res.json({ errors: ["No user with that email."] });
            
            bcrypt.compare(password, results[0].password, (err, result) => {
                if(err) return res.json({ errors: ["Something went wrong. Please try again later.2"] });

                if(result) {
					console.log(`${results[0].username} has been authenticated.`); res.cookie()
                    res.cookie("auth", jwt.sign({ alg: "HS256", type: "jwt" }, { sub: results[0].id, username: results[0].username, iat: Math.floor(new Date().getTime() / 1000), exp: Math.floor(new Date().getTime() / 1000) + 86400 }));
                    return res.json({ ok: true });
                }
				return res.json({ errors: ["Invalid credentials."] });
            });
        });
        connection.release();
    });
    
});


// Purpose: Register API, registers users.
router.post("/register", (req, res) => {
	let errors = []; // Error messages to return in response

	// Form fields
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;

	// Check if fields were actually sent.
	if(!req.body.email) errors.push("Email is required.");
	if(!req.body.username) errors.push("Username is required.");
	if(!req.body.password) errors.push("Password is required.");
	if(errors.length > 0) return res.json({ errors: errors });

	// Perform validation which does not require db access
	if(!validator.isEmailValid(email));
	if(!validator.isUsernameValid(username)) errors.push("Username must contain 3-16 characters and may only include a-z, A-Z, 0-9 or _");
	if(!validator.isPasswordValid(password)) errors.push("Password must be at least 8 characters in length, contain both a lowercase and uppercase character, a number, and a symbol.");

	db.getConnection((err, connection) => {
		if(err) errors.push("Something went wrong. Please try again later.");

		validator.isEmailRegistered(email, connection,  result => {
			if(result == true) errors.push("Email is already registered");
		});

		validator.isUsernameRegistered(username, connection, result => {
			if(result == true) errors.push("That username is taken.");
		});

		bcrypt.hash(password, 10, (err, hash) => {
			if(err) errors.push("Something went wrong. Please try again later.");

			if(errors.length > 0) return res.json({errors: errors});

			connection.query(`INSERT INTO users (email, username, password) VALUES (${mysql.escape(email.toLowerCase())}, ${mysql.escape(username)}, ${mysql.escape(hash)})`, err => {
				if(err) {
					errors.push("Something went wrong. Please try again later.");
					return res.json({errors: errors});
				}
				console.log(`New member: ${username}`);
				return res.json({ ok: true });
			});
		});
		connection.release();
	});
});

module.exports = router;
