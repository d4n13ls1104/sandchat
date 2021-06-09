import { pool } from "../util/sand-db";
import { extractPayloadFromToken, verify } from "../util/sand-jwt";

const whitelisted_paths = [
    "/",
    "/login",
    "/register",
    "/user/count",
];

const auth = (req: any, res: any, next: any) => {
    if(!whitelisted_paths.includes(req.baseUrl + req.path)) {
        if(!req.cookies.auth || req.cookies.auth.split(".").length != 3) {
            res.clearCookie("auth");
            return res.redirect("/login");
        }

        const payload = extractPayloadFromToken(req.cookies.auth); // bug occurs here
        
        pool.getConnection((err, connection) => {
            connection.query(`SELECT tokenVersion FROM users WHERE id=${escape(""+payload.sub)}`, (err, result) => {
                if(result.length === 0) return res.redirect("/login");
                if(!verify(req.cookies.auth, result[0].tokenVersion)) {
                    res.clearCookie("auth");
                    res.redirect("/login");
                    return;
                }
            });
        })
    }
    next();
}

export default auth;
