// NPM MODULES
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

// SAND MODULES
const validator = require("../util/sand-validator");
const db = require("../util/sand-db").pool;

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


// Purpose: Register API, registers users.
router.post("/register", (req, res) => {
	var errors = []; // Error messages to return in response

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

		bcrypt.hash(password, 12, (err, hash) => {
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
