import { escape } from "mysql";
import { pool } from "./sand-db";

// -----------------------------------------------------------
// Purpose: Check if email is valid
// -----------------------------------------------------------
export const isEmailValid = (email: string): boolean => {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.toLowerCase());
}

// -----------------------------------------------------------
// Purpose: Check if username is valid
// -----------------------------------------------------------
export const isUsernameValid = (username: string): boolean => {
    return (/^[a-zA-Z0-9_]+$/).test(username);
}

// -----------------------------------------------------------
// Purpose: Check if password meets our standards
// -----------------------------------------------------------
export const isPasswordValid = (password: string): boolean => {
    return (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/).test(password);
}

// -----------------------------------------------------------
// Purpose: Check if email is already registered
// -----------------------------------------------------------
export const isEmailRegistered = (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }
            connection.query(`SELECT 1 FROM users WHERE email='${escape(email)}'`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                if(result.length > 0) resolve(true);

                resolve(false);
            });
            connection.release();
        });
    });
}

// -----------------------------------------------------------
// Purpose: Check if username is already registered
// -----------------------------------------------------------
export const isUsernameRegistered = (username: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later");
            }
            connection.query(`SELECT 1 FROM users WHERE username='${escape(username)}'`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                if(result.length > 0) resolve(true);

                resolve(false);
            });
            connection.release();
        });
    });
}


// -----------------------------------------------------------
// Purpose: Make sure param is a string
// -----------------------------------------------------------
export const sanitizeParam = (param: any): string => {
    return typeof param === "object" ? param[0] : param;
}
