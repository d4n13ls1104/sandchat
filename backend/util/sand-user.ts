import { escape } from "mysql";
import { pool } from "./sand-db";
import { sign, verify } from "./sand-jwt";

const _DEFAULT_ACCESS_TOKEN_LIFE = 604800; // Access token life in seconds

interface UserAccount {
    email: string,
    username: string,
    password: string
    tokenVersion?: number
};

export const createUserAccount = (account: UserAccount): boolean => {
    try {
        pool.getConnection((err, connection) => {
            if(err) throw new Error(err.message);
            
            connection.query(`INSERT INTO users (email, username, password) VALUES (${escape(account.email)}, ${escape(account.username)}, ${escape(account.password)})`, (err) => {
                throw new Error(err.message);
            });
            connection.release();
        });  
    } catch {
        return false;
    }

    return true;
}

export const deleteUserAccount = (id: number): boolean => {
    try {
        pool.getConnection((err, connection) => {
            if(err) throw new Error(err.message);

            connection.query(`DELETE FROM users WHERE id=${escape(id)}`, (err) => {
                if(err) throw new Error(err.message);
            });
            connection.release();
        })
    } catch {
        return false;
    }

    return true;
}

export const getUserAccountById = (id: number): UserAccount | boolean => {
    try {
        pool.getConnection((err, connection) => {
            if(err) throw new Error(err.message);
            
            connection.query(`SELECT email, username, password FROM users WHERE id=${escape(id)}`, (err, results) => {
                if(err) throw new Error(err.message);
                if(results.length === 0) throw new Error("No user with that id!");
                
                return {
                    email: results[0].email,
                    username: results[0].username,
                    password: results[0].password,
                    tokenVersion: results[0].tokenVersion
                };
            });
            connection.release();
        });
    } catch {
        return false;
    }
}

export const signTokenForUser = (id: number, refresh?: boolean): string | boolean => {
    const user = getUserAccountById(id);
    if(typeof user != "object") return false;

    return sign({
        alg: "HS256",
        type: refresh ? "refresh" : "access"
    },
    {
        sub: id,
        username: user.username,
        version: user.tokenVersion,
        iat: new Date().getTime() / 1000,
        exp: (new Date().getTime() / 1000) + _DEFAULT_ACCESS_TOKEN_LIFE
        
    },
    refresh);
}

export const verifyTokenForUser = (id: number, token: string, refresh: boolean): boolean => {
    const user = getUserAccountById(id);
    if(typeof user != "object") return false;

    return verify(token, user.tokenVersion, refresh);
}

export const revokeTokensForUser = (id: number): boolean => {
    try {
        pool.getConnection((err, connection) => {
            if(err) throw new Error(err.message);
            connection.query(`UPDATE users SET tokenVersion= tokenVersion + 1 WHERE id=${escape(id)}`, (err) => {
                if(err) throw new Error(err.message);
                return true;
            });
            connection.release();
        });
    } catch {
        console.error(`Could not revoke tokens for user: ${id}`);
        return false;
    }
}
