import * as config from "misc/config.json";
import mysql from "mysql";

export const pool = mysql.createPool(config);
