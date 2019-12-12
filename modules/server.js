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
const accountsRouter = require('../routes/accounts')
const gameRouter = require("../routes/games")
// TEST PGSQL
const testRouter = require('../routes/test')

/**
 * Variables
 */

// Global variables
const host = process.env.SERVER_HOST;
const port = process.env.PORT || 8080;
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
app.use(usersRouter)
app.use(gameRouter);

// Secure the API
app.use(authMiddleware)
// Other routes
app.use('/gallery', galleryRouter)
app.use('/quotes', quotesRouter)
app.use('/accounts', accountsRouter)


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
exports.app = app