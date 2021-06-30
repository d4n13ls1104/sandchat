import { escape } from "mysql";
import { pool } from "util/sand-db";
import { sign } from "util/sand-jwt";

export const _DEFAULT_ACCESS_TOKEN_LIFE = 604800; // Access token life in seconds.

interface UserAccount {
    email: string,
    username: string,
    password: string
    tokenVersion?: number
}

/**
 * Creates a user account
 * @param account 
 * @returns boolean
 */
export const createUserAccount = (account: UserAccount): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`INSERT INTO users (email, username, password) VALUES (${escape(account.email)}, ${escape(account.username)}, ${escape(account.password)})`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }
                resolve(true);
            });
        });
    });
}

/**
 * Deletes an account in the database by id
 * @param id 
 * @returns boolean
 */
export const deleteUserAccount = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`DELETE FROM users WHERE id=${escape(id)}`, (err) => {
                if(err) {
                    console.error(err);
                    reject({
                        reason: "Something went wrong. Please try again later."
                    });
                }
                resolve(true);
            });
            connection.release();
        });
    });
}

/**
 * Get the details of an account by ID
 * @param id 
 * @returns UserAccount
 */
export const getUserAccountById = (id: number): Promise<UserAccount> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            // Select user info by ID
            connection.query(`SELECT email, username, password, tokenVersion FROM users WHERE id=${escape(id)}`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                // If user doesn't exist
                if(result.length === 0) reject("Something went wrong. Please try again later.");

                // If promise hasn't been rejected return user info
                resolve({
                    email: result[0].email,
                    username: result[0].username,
                    password: result[0].password,
                    tokenVersion: result[0].tokenVersion
                });
            });
            connection.release();
        });
    });
}

/**
 * Revoke users access tokens by incrementing their token version
 * @param id 
 * @returns boolean
 */
export const revokeTokensForUser = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`UPDATE users SET tokenVersion = tokenVersion + 1 WHERE id=${escape(id)}`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }
                resolve(true);
            });
            connection.release();
        });
    });
}

/**
 * Sign token for user by their ID
 * @param id 
 * @returns string
 */
export const signTokenForUser = (id: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        getUserAccountById(id).then(user => {
            const token = sign({
                alg: "HS256",
                type: "access"
            },
            {
                sub: id,
                username: user.username,
                version: user.tokenVersion!,
                iat: Math.floor(new Date().getTime() / 1000),
                exp: Math.floor(new Date().getTime() / 1000) + _DEFAULT_ACCESS_TOKEN_LIFE
            });

            resolve(token);
        }).catch(reason => {
            reject(reason);
        });
    });
}

/**
 * Add a user to a channel by ID
 * @param user 
 * @param channel 
 * @returns boolean
 */
export const addUserToChannel = (user: number, channel: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`INSERT INTO channel_memberships (user, channel) VALUES (${escape(user)}, ${escape(channel)})`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                resolve(true);
            });
            connection.release();
        });
    });
}

/**
 * Remove a user from channel by ID
 * @param user 
 * @param channel 
 * @returns boolean
 */
export const removeUserFromChannel = (user: number, channel: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`DELETE FROM channel_memberships WHERE user=${escape(user)} AND channel=${escape(channel)}`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                resolve(true);
            });
            connection.release();
        });
    });
}

/**
 * Check if a user is a member of channel by ID
 * @param user 
 * @param channel 
 * @returns 
 */
export const isUserChannelMember = (user: number, channel: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`SELECT 1 FROM channel_memberships WHERE user=${escape(user)} AND channel=${escape(channel)}`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                if(result.length === 0) reject("You are not a member of this channel.");

                resolve(true);
            });
            connection.release();
        });
    });
}

/**
 * Send a message to channel for a user by ID
 * @param user 
 * @param channel 
 * @param content 
 * @returns boolean
 */
export const sendMessageForUser = (user: number, channel: number, content: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        isUserChannelMember(user, channel)
        .catch(reason => reject(reason));

        if(content.trim() === "") reject("Message is empty.");
        if(content.length > 4000) reject("Message cannot be over 4000 characters");

        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`INSERT INTO messages (author, channel, content) VALUES (${escape(user)}, ${escape(channel)}, ${escape(content)})`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                resolve(true);
            });
            connection.release();
        });
    });
}
