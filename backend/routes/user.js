// NPM MODULES
import { Router } from "express";
import { hash } from "bcrypt";

// SAND MODULES
import * as validator from "../util/sand-validator";
import { pool } from "../util/sand-db";
import { createUserAccount, signTokenForUser, verifyTokenForUser } from "../util/sand-user";

const router = Router();

// Purpose: API to return the number of users that are registered
router.get("/count", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) return res.json({ errors: ["Something went wrong. Please try again later."] });
        connection.query("SELECT COUNT(id) AS count FROM users", (err, result) => {
            if(err) return res.json({ errors: ["Something went wrong. Please try again later."] });
            return res.json({ count: result[0].count });
        });
        connection.release();
    });
});

// Purpose: Register API, registers users.. why did i even add this comment
router.post("/register", (req, res) => {
    let errors = []; // Error messages to return in response

    // Form fields
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Check if fields were actually sent
    if(!req.body.email) errors.push("Email is required.");
    if(!req.body.username) errors.push("Username is required.");
    if(!req.body.password) errors.push("Password is required.");
    
    if(errors.length > 0) return res.json({ errors: errors });

    // Perform validation
    if(!validator.isEmailValid(email)) errors.push("The email you provided is invalid.");
    if(!validator.isUsernameValid(username)) errors.push("Username must contain 3-16 characters and may only include a-z, A-Z, 0-9, or _.");
    if(!validator.isPasswordValid(password)) errors.push("Password must be at least 8 characters in length, contain both a lowercase and uppercase character, a number, and a symbol.");

    pool.getConnection((err, connection) => {
        if(err) return res.json({ errors: ["Something went wrong. Please try again later."] });
        
        validator.isEmailRegistered(email, connection, (result) => {
            if(result) errors.push("That email is already registered.");
        });

        validator.isUsernameRegistered(username, connection, (result) => {
            if(result) errors.push("That username is taken.");
        });

        hash(password, 10, (err, hash) => {
            if(err) errors.push("Something went wrong. Please try again later.");

            if(errors.length > 0) return res.json({ errors: errors });

            const acc = createUserAccount({
                email: email,
                username: username,
                password: hash
            });

            if(!acc) errors.push("Something went wrong. Please try again later.");
            return res.json({ errors: errors });
        });
        connection.release();
    });
});

// TODO: WRITE AUTH ROUTE

export default Router;
