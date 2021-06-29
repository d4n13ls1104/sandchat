import { escape } from "mysql";
import { pool } from "util/sand-db";

const _DEFAULT_FETCH_LIMIT = 30;

// -----------------------------------------------------------
// Purpose: Define message type.
// -----------------------------------------------------------
interface Message {
    author: string,
    content: string,
    timestamp: string
}

// -----------------------------------------------------------
// Purpose: Given the channel id, check if channel exists.
// -----------------------------------------------------------
export const checkChannelExists = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`SELECT 1 FROM channels WHERE id='${escape(id)}'`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }
                if(result.length === 0) reject("Channel doesn't exist.");

                resolve(true);
            });
            connection.release();
        });
    });
}

// -----------------------------------------------------------
// Purpose: Create new channel, returns new channel's id
// -----------------------------------------------------------
export const createChannel = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`INSERT INTO channels (id) OUTPUT INSERTED.id VALUES (NULL)`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Could not create channel.");
                }

                resolve(result[0].id);
            });
            connection.release();
        });
    });
}

// -----------------------------------------------------------
// Purpose: Delete channel by its id.
// -----------------------------------------------------------
export const deleteChannel = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`DELETE FROM channels WHERE id='${escape(id)}'`, (err) => {
                if(err) {
                    console.error(err);
                    reject("Could not delete channel.");
                }

                resolve(true);
            });
            connection.release();
        });
    });
}

// -----------------------------------------------------------
// Purpose: Fetch messages from channel before given date.
// -----------------------------------------------------------
export const fetchMessagesFromChannelBeforeDate = (channel: number, beforeDate: string): Promise<Message[] | {}> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.error(err);
                reject("Something went wrong. Please try again later.");
            }

            connection.query(`SELECT users.username, messages.content, messages.timestamp FROM messages INNER JOIN users ON messages.author=users.id WHERE messages.channel=${escape(channel)} AND messages.timestamp < ${escape(beforeDate)} AND messages.deleted=0 LIMIT ${_DEFAULT_FETCH_LIMIT}`, (err, result) => {
                if(err) {
                    console.error(err);
                    reject("Something went wrong. Please try again later.");
                }

                if(typeof result === "undefined" || result.length === 0) resolve({});

                let response: Message[] = [];

                for(let i = 0; i < result.length; i++) {
                    response.push({
                        author: result[i].username,
                        content: result[i].content,
                        timestamp: result[i].timestamp
                    });
                }

                resolve(response);
            });
            connection.release();
        });
    });
}
