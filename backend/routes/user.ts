// NPM MODULES
import { Router } from "express";
import * as bcrypt from "bcrypt";

// SAND MODULES
import * as validator from "../util/sand-validator";
import { pool } from "../util/sand-db";
import { createUserAccount, _DEFAULT_ACCESS_TOKEN_LIFE } from "../util/sand-user";
import { extractPayloadFromToken, sign, verify } from "../util/sand-jwt";
import auth from "../middleware/sand-auth";

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

router.get("/payload", auth, (req, res) => {
    console.log(extractPayloadFromToken(req.cookies.auth));
    res.json(extractPayloadFromToken(req.cookies.auth));
});



router.post("/auth", (req, res) => {
    if(req.cookies.auth && req.cookies.auth.split(".").length == 3) {
        const payload = extractPayloadFromToken(req.cookies.auth);
        
        pool.getConnection((err, connection) => {
            connection.query(`SELECT tokenVersion FROM users WHERE id=${escape((""+payload.sub))}`, (err, result) => {
                if(result.length > 0)
                    if(verify(req.cookies.auth, result[0].tokenVersion)) return res.json({ errors: ["You are already authenticated!. Please logout first!"] }).end();
            });
            connection.release();
        });
    }
    
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if(!req.body.email) return res.json({ errors: ["Email is required."] });
    if(!req.body.password) return res.json({ errors: ["Password is required"] });

    try {
        pool.getConnection((err, connection) => {

            if(err) throw new Error(err.message);

            connection.query(`SELECT id, username, tokenVersion, password FROM users WHERE email='${escape(email)}'`, (err, results) => {
                if(err) throw new Error(err.message);

                if(results.length == 0) return res.json({ errors: ["No account with that email."] });

                bcrypt.compare(password, results[0].password).then(result => {
                    if(!result) return res.json({ errors: ["Incorrect credentials."] });

                    const token = sign({
                        alg: "HS256",
                        type: "access"
                    },
                    {
                        sub: results[0].id,
                        username: results[0].username,
                        version: results[0].tokenVersion,
                        iat: Math.floor(new Date().getTime() / 1000),
                        exp: Math.floor(new Date().getTime() / 1000) + _DEFAULT_ACCESS_TOKEN_LIFE
                    });
                    
                    res.cookie("auth", token, { httpOnly: true, maxAge: _DEFAULT_ACCESS_TOKEN_LIFE * 1000 });
                    res.json({ ok: true });
                }).catch(err => console.error(err));
            });
            connection.release();
        });
    } catch(err) {
        console.error(err);
    }
});


// Purpose: Register API, registers users.. why did i even add this comment
router.post("/register", (req, res) => {
    let errors: string[] = []; // Error messages to return in response

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

        bcrypt.hash(password, 10, (err, hash) => {
            if(err) errors.push("Something went wrong. Please try again later.");

            if(errors.length > 0) return res.json({ errors: errors });

            const acc = createUserAccount({
                email: email,
                username: username,
                password: hash
            });

            if(!acc) {
                errors.push("Something went wrong. Please try again later.");
                return res.json({ errors: errors });
            }

            return res.json({ ok: true });
            
        });
        connection.release();
    });
});

export default router;
