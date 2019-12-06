/**
 * Imports
 */
const {
    Pool
} = require('pg')



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