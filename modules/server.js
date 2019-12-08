/**
 * Load modules
 */

const express = require('express')
const bodyParser = require('body-parser')
const authMiddleware = require('./middlewares').authMiddleware
const loggerMiddleware = require('./middlewares').loggerMiddleware
const authRouter = require('../routes/auth')
const usersRouter = require('../routes/users')
const galleryRouter = require('../routes/gallery')
const quotesRouter = require('../routes/quotes')
// TEST PGSQL
const testRouter = require('../routes/test')

/**
 * Variables
 */

// Global variables
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const app = express();

/**
 * Configuration
 */

app.use(loggerMiddleware)

// limit : it controls the maximum request body size. 
app.use(bodyParser.json({
    limit: "1.1MB"
}));
// TEST PGSQL
app.use('/test', testRouter)
// Configure routes
app.use(authRouter)
// Secure the API
app.use(authMiddleware)
// Other routes
app.use('/users', usersRouter)
app.use('/gallery', galleryRouter)
app.use('/quotes', quotesRouter)


// Start server
var start = function (callback) {
    app.listen(port, () => {
        console.info(`[Server] Listening on ${port}`)
        if (callback) callback(null)
    })
};


/**
 * Exports
 */
exports.start = start