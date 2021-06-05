const jwt = require("../misc/jwt.json");
const sha256 = require("js-sha256");
const base64 = require("base64url");

const sign = (header, payload) => {
    const token = base64(JSON.stringify(header)) + "." + base64(JSON.stringify(payload)) + "."; // Create first and second segments
    const signature = base64(sha256(base64(JSON.stringify(header)) + "." + base64(JSON.stringify(payload)) + jwt.secret)); // Create signature
    return token + signature; // return all segments together
}

const verify = (token) => {
    const parts = token.split("."); // separate the token segments
    if(parts.length != 3) return false; // If token doesn't contain 3 segments its invalid therefore return false

    if(base64(sha256(parts[0] + "." + parts[1] + jwt.secret)) != parts[2]) return false; // If token is invalid return false
    if(JSON.parse(base64.decode(parts[1])).exp < Math.floor(new Date().getTime() / 1000)) return false; // If token is expired return false

    return true; // if none of the above conditions are met return true
}

module.exports = {
    sign,
    verify
}

// USE EXAMPLE: console.log(sign({algo: "HS256", type: "jwt"}, {sub: 1, username: "Drew", iat: Math.floor(new Date().getTime() / 1000), exp: Math.floor(new Date().getTime() / 1000) + 60}));
