import { escape } from "mysql";

type FunctionBoolCallback = (result: boolean) => void

// Purpose: Check if email is valid
export const isEmailValid = (email: string): boolean => {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.toLowerCase());
}

export const isUsernameValid = (username: string): boolean => {
    return (/^[a-zA-Z0-9\_]+$/).test(username);
}

// Purpose: Check if password meets standards
export const isPasswordValid = (password: string): boolean => {
    return (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/).test(password);
}

// Purpose: Check if email is already registered
export const isEmailRegistered = (email: string, connection: any, callback: FunctionBoolCallback) => {
    connection.query(`SELECT 1 FROM users WHERE email=${escape(email)}`, (err: any, result: any[]) => {
        if(err) console.error(err);
        if(result.length > 0) return callback(true);
    });

    callback(false);
}

// Purpose: Check if email is already registered
export const isUsernameRegistered = (username: string, connection: any, callback: FunctionBoolCallback) => {
    connection.query(`SELECT 1 FROM users WHERE username=${escape(username)}`, (err: any, result: any[]) => {
        if(err) console.error(err);
        if(result.length > 0) return callback(true);
    });

    callback(false);
}
