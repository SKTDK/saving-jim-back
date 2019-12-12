/**
 * Imports
 */
const {
    Pool
} = require('pg')


if(process.env.NODE_ENV === "test"){
    require("dotenv").config("/../.env");
}

/**
 * Connection pool
 */
const pool = new Pool({
    connectionString: process.env.CONN
});

/**
 * Exports
 */
exports.db = pool