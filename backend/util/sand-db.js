const config = require("../misc/config.json"); // DB Connection info
const mysql = require("mysql"); // MySQL lib

const pool = mysql.createPool(config);

module.exports = {
    pool
};
