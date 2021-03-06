/**
 * Load modules
 */

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const db = require('../modules/db')
const config = require('../modules/config')

/**
 * Variables
 */

const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10



/**
 * Routes
 */

router.post("/login", function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    // Checking if data is valid before sending it to remote DB server
    if (!username || !password) {
        res.status(412).json({
            success: false,
            error: "Password and username needed"
        })
        return
    }

    // Checking if data is valid before sending it to remote DB server
    if (!password.match(config.REGEX_PASSWORD) || password.length > config.LEN_PASSWORD || !username.match(config.REGEX_USERNAME) || username.length > config.LEN_USERNAME) {
        res.status(413).json({
            success: false,
            error: "Invalid username/password"
        })
        return
    }

    // Prepared statement
    // It is a bad practice to use * so we list evrything, so if tables change in the database it does not corrupt the code.
    db.db.query('SELECT id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version FROM savingjim.users where username=$1', [username])
        .then(result => {
            user = result.rows[0];
            if (user) {
                //If the account is not active anymore he can't connect
                if (user.active === true) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result) {
                            const exp = Date.now() + 24 * 60 * 60 * 1000; // 12h
                            jwt.sign({
                                user: user,
                                exp: exp
                            }, process.env.JWT_SECRET, (err, token) => {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        error: "error during token signing"
                                    })
                                } else {
                                    delete user.password
                                    res.status(200).json({
                                        success: true,
                                        user,
                                        token
                                    })
                                }
                            });
                        } else {
                            res.status(401).json({
                                success: false,
                                error: "bad password"
                            })
                        }
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        error: "Account is inactive, you can't connect anymore"
                    })
                }
            } else {
                res.status(401).json({
                    success: false,
                    error: "bad username"
                })
            }

        })
        .catch(e => console.error(e.stack))
    return;
})

/**
 * Exports
 */

module.exports = router;