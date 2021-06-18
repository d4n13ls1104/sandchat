import { NextFunction, Request, Response } from "express";
import { pool } from "../util/sand-db";
import { extractPayloadFromToken, verify } from "../util/sand-jwt";

// -----------------------------------------------------------
// Purpose: Define paths which do not require authentication.
// -----------------------------------------------------------
const whitelisted_paths = [
    "/",
    "/login",
    "/register",
    "/api/user/count",
    "/api/user/register",
    "/api/user/login"
];


// -----------------------------------------------------------
// Purpose: Auth middleware
// -----------------------------------------------------------
const auth = (req: Request, res: Response, next: NextFunction) => {
    if(!whitelisted_paths.includes(req.baseUrl + req.path)) {
        // If path requires authentication:
        if(!req.cookies.auth || req.cookies.auth.split(".").length != 3) {
            res.clearCookie("auth"); // Get rid of the auth cookie so a redirect loop doesn't happen
            res.redirect("/login"); // Redirect user to login page
            return;
        }

        const payload = extractPayloadFromToken(req.cookies.auth); // Get user info from token
        
        pool.getConnection((err, connection) => {
            connection.query(`SELECT tokenVersion FROM users WHERE id=${escape(payload.sub.toString())}`, (err, result) => {
                if(!verify(req.cookies.auth, result[0].tokenVersion)) {
                    // If token is invalid murder the token and redirect user to login
                    res.clearCookie("auth");
                    console.log(req.baseUrl + req.path);
                    if((req.baseUrl + req.path).startsWith("/api")) {
                        return res.sendStatus(403).json({ ok: false });
                    }
                    return res.redirect("/login");
                }

                if(result.length === 0) {
                    return res.redirect("/login");
                } // If no valid user is found in token payload redirect user to login
            });
            connection.release();
        });
    }
    next();
}

export default auth;
