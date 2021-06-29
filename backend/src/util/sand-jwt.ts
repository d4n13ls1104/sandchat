import base64 from "base64url";
import { sha256 } from "js-sha256";
import jwt from "misc/jwt.json";

export interface Header {
    alg: string,
    type: string
};

export interface Payload {
    sub: number,
    username: string,
    version: number,
    iat: number,
    exp: number
};

// -----------------------------------------------------------
// Purpose: Extract payload from token as JSON
// -----------------------------------------------------------
export const extractPayloadFromToken = (token: string): Payload => {
    return JSON.parse(base64.decode(token.split(".")[1])); // ez
}

// -----------------------------------------------------------
// Purpose: Sign JWT
// -----------------------------------------------------------
export const sign = (header: Header, payload: Payload): string => {

    const token = `${base64(JSON.stringify(header))}.${base64(JSON.stringify(payload))}` // Create first and second segments
    const signature = base64(sha256(token + jwt.secret));

    return `${token}.${signature}`;
}

// -----------------------------------------------------------
// Purpose: Verify that JWT is valid.
// -----------------------------------------------------------
export const verify = (token: string, tokenVersion: number): boolean => {
    
    const segments = token.split("."); // separate the token segments
    if(segments.length != 3) return false; // If token doesn't contain 3 segments it is invalid therefore return false

    if(base64(sha256(segments[0] + "." + segments[1] + jwt.secret)) != segments[2]) return false; // if token signature is invalid return false
    if(JSON.parse(base64.decode(segments[1])).exp < Math.floor(new Date().getTime() / 1000)) return false; // if token is expired return false
    if(JSON.parse(base64.decode(segments[1])).version != tokenVersion) return false; // if token version doesnt match token version on user return false

    return true; // if none of the above conditions are met return true;
}
