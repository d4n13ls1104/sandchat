import { escape } from "mysql";
import { pool } from "util/sand-db";

/**
 * Check if an email is valid
 * @param email 
 * @returns boolean
 */
export const isEmailValid = (email: string): boolean => {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.toLowerCase());
}

/**
 * Check if a username is valid
 * @param username 
 * @returns boolean
 */
export const isUsernameValid = (username: string): boolean => {
    return (/^[a-zA-Z0-9_]+$/).test(username);
}

/**
 * Checks if a password is valid and meets our standards
 * @param password 
 * @returns boolean
 */
export const isPasswordValid = (password: string): boolean => {
    return (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/).test(password);
}

/**
 * Checks if an email is registered in the database
 * @param email 
 * @returns boolean
 */
export const isEmailRegistered = (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }
            connection.query(`SELECT 1 FROM users WHERE email=${escape(email)}`, (err, result) => {
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

/**
 * Checks if a username is already registered in the database
 * @param username 
 * @returns boolean
 */
export const isUsernameRegistered = (username: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later");
            }
            connection.query(`SELECT 1 FROM users WHERE username=${escape(username)}`, (err, result) => {
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


/**
 * Makes sure param is a string
 * @param param 
 * @returns string
 */
export const sanitizeParam = (param: any): string => {
    return typeof param === "object" ? param[0] : param;
}
