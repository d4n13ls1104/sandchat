import { escape } from "mysql";
import { pool } from "../util/sand-db";

const whitelist = (req: any, res: any, next: any) => {
    const ip = parseIP(req.connection.remoteAddress);
    console.log(ip);

    pool.getConnection((err, connection) => {
        if(err) {
            console.error(err);
            res.send("Something went wrong. Please try again later.");
            return;
        }

        connection.query(`SELECT 1 FROM whitelist WHERE ip=${escape(ip)}`, (error, results) => {
            if(error) {
                console.error(error);
                res.send("Something went wrong. Please try again later.");
                return;
            }

            if(results.length > 0) return next();
            return res.send("You are not whitelisted!");
        });
        connection.release();
    });
}

const parseIP = (ip) => {
    if(ip.substring(0, 7) === "::ffff:") return ip.substring(7, ip.length);

    return ip;
}

export default whitelist;
