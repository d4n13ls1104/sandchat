const config = require("../misc/config.json"); // DB Connection info
const mysql = require("mysql"); // MySQL lib

// Purpose: Get db connection
function getDBConnection() {
    return mysql.createConnection(config);
}

module.exports = {
    getDBConnection
};