const express = require("express");
const validator = require("../util/sand-validator");
const db = require("../util/sand-db");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const router = express.Router();

router.get("/count", (req, res) => {
	var connection = db.getDBConnection();
	connection.query("SELECT COUNT(id) AS count FROM users", (err, result) => {
		if(err) return res.json({errors: ["Something went wrong. Please try again later."]});
		return res.json({ count: result[0].count });
	});
});

router.post("/register", (req, res) => {
	var errors = []; // Error messages to return in response

	// Form fields
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;

	if(!req.body.email) errors.push("Email is required.");
	if(!req.body.username) errors.push("Username is required.");
	if(!req.body.password) errors.push("Password is required.");
	if(errors.length > 0) return res.json({ errors: errors });

	if(!validator.isEmailValid(email)) errors.push("Please enter a valid email.");

	validator.isEmailRegistered(email, result => {
		if(result == true) errors.push("Email is already registered");
	});

	if(!validator.isUsernameValid(username)) errors.push("Username must contain 3-16 characters and may only include a-z, A-Z, 0-9 or _");
	
	validator.isUsernameRegistered(username, result => {
		if(result == true) errors.push("That username is taken.");
	});

	if(!validator.isPasswordValid(password)) errors.push("Password must be at least 8 characters in length, contain both a lowercase and uppercase character, a number, and a symbol.");

	bcrypt.hash(password, 10, (err, hash) => {
		if(errors.length > 0) return res.json({errors: errors});

		if(err) {
            console.log(err);
			errors.push("Something went wrong. Please try again later.");
			return res.json(errors);
		}

		var connection = db.getDBConnection();
		connection.query(`INSERT INTO users (email, username, password) VALUES (${mysql.escape(email.toLowerCase())}, ${mysql.escape(username)}, ${mysql.escape(hash)})`, err => {
			if(err) {
                console.log(err);
				errors.push("Something went wrong. Please try again later.");
				return res.json({errors: errors});
			}
			console.log(`New member: ${username}`);
            return res.json({ ok: true });
		});
		connection.end();
	});
});

module.exports = router;