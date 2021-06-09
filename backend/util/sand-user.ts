import { escape } from "mysql";
import { pool } from "./sand-db";

export const _DEFAULT_ACCESS_TOKEN_LIFE = 604800; // Access token life in seconds

interface UserAccount {
    email: string,
    username: string,
    password: string
    tokenVersion?: number
};

type AccountCallback = (account: UserAccount) => void

export const createUserAccount = (account: UserAccount): boolean => {
    try {
        pool.getConnection((err, connection) => {
            if(err) throw new Error(err.message);
            
            connection.query(`INSERT INTO users (email, username, password) VALUES (${escape(account.email)}, ${escape(account.username)}, ${escape(account.password)})`, (err) => {
                if(err) throw new Error(err.message);
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
        pool.getConnection((err, connection) =>     {
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

export const getUserAccountById = (id: number, callback: AccountCallback): UserAccount | boolean => {
    pool.getConnection((err, connection) => {
            
        connection.query(`SELECT email, username, password, tokenVersion FROM users WHERE id='${escape(id)}'`, (err, results) => {
            if(results.length === 0) console.log("ERROR");

            callback({
                email: results[0].email,
                username: results[0].username,
                password: results[0].password,
                tokenVersion: results[0].tokenVersion
            });
            
            return {
                email: results[0].email,
                username: results[0].username,
                password: results[0].password,
                tokenVersion: results[0].tokenVersion
            };
        });
        connection.release();
    });
    return false;
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
    return false;
}
