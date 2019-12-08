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

const saltRounds = process.env.SALT_BCRYPT || 10

router.post("/addManager", function (req, res, next) {

    var firstname = req.body.username;
    var lastname = req.body.username;
    var username = req.body.username;
    var password = req.body.password;

    // Checking if data is valid before sending it to remote DB server
    if (!firstname || !lastname || !username || !password) {
        res.status(412).json({
            success: false,
            error: "Wrong data sent! (1)"
        })
        return
    }

    // Checking if data is valid before sending it to remote DB server
    if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME || !lastname.match(config.REGEX_NAME) ||
        lastname.length > config.LEN_NAME || !password.match(config.REGEX_PASSWORD) || password.length > config.LEN_PASSWORD ||
        !username.match(config.REGEX_USERNAME) || username.length > config.LEN_USERNAME) {

        res.status(413).json({
            success: false,
            error: "Wrong data sent! (2)"
        })
        return
    }

    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            res.status(500).json({
                success: false,
                error: "Unable to hash password"
            })
        } else {
            password = hash;
            // Insert user into DB
            db.db.query('INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version) VALUES (default, 1, $1, $2, $3, $4, true, NOW(), NULL, 1)', [firstname, lastname, username, password])
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            success: true
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            error: "bad username"
                        })
                    }

                })
                .catch(e => console.error(e.stack))
            return;
        }
    });

});

router.post("/usersByAccountType", function (req, res, next) {

    var accountType = req.body.accountType;

    // Checking if data is valid before sending it to remote DB server
    if (accountType === '0' || accountType === '1' || accountType === '2' || accountType === '3') {
        res.status(412).json({
            success: false,
            error: "Wrong data sent! (1)"
        })
        return
    }


    db.db.query('SELECT id, account_type, first_name, last_name, username, active, modified_on, modified_by, version FROM savingjim.users where account_type=$1', [accountType])
        .then(result => {
            if (result) {
                var xd = result.rows;
                res.setHeader("content-type", "application/json; charset=utf-8");
                res.send(xd);
            } else {
                res.status(401).json({
                    success: false,
                    error: "bad username"
                })
            }

        })
        .catch(e => console.error(e.stack))
    return;


});

router.post("/changeAccountState", function (req, res, next) {

    var username = req.body.username;
    var active = req.body.active;

    if (!username) {
        res.status(412).json({
            success: false,
            error: "Wrong data sent! (1)"
        })
        return
    }

    if (!username.match(config.REGEX_USERNAME) || username.length > config.LEN_USERNAME) {
        res.status(413).json({
            success: false,
            error: "Wrong data sent! (3)"
        })
        return
    }

    db.db.query('UPDATE savingjim.users SET active=$1 WHERE username=$2', [active, username])
        .then(result => {
            if (result) {
                res.status(200).json({
                    success: true
                })
            } else {
                res.status(401).json({
                    success: false,
                    error: "bad username"
                })
            }

        })
        .catch(e => console.error(e.stack))
    return;


});
module.exports = router;