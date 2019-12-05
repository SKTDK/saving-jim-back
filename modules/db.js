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
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: true
})

/**
 * Exports
 */
exports.db = pool