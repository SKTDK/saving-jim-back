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


router.post("/addUser", function (req, res, next) {

    var accountType = req.body.accountType;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    
    var payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // Checking if data is valid before sending it to remote DB server
    if (accountType < 0 || accountType > 3) {
        res.status(412).json({
            success: false,
            error: "Wrong data sent!"
        })
        return
    }

    // if not an admin, cant create another admin
    if (payload.user.account_type !== 0) {
        if (accountType === 0) {
            // not allowed
            res.status(500);
            return;
        }
    }

    // not allowed to create an admin
    if (payload.user.account_type === 1) {
        if (accountType === 0) {
            // not allowed
            res.status(500);
            return;
        }
    }

    // not allowed to create anything
    if (payload.user.account_type === 2 || payload.user.account_type === 3) {

        // not allowed
        res.status(500);
        return;

    }
    // Checking if data is valid before sending it to remote DB server
    if (!firstname || !lastname || !username || !password) {
        res.status(412).json({
            success: false,
            error: "Wrong data sent!"
        })
        return
    }

    // Checking if data is valid before sending it to remote DB server
    if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME || !lastname.match(config.REGEX_NAME) ||
        lastname.length > config.LEN_NAME || !password.match(config.REGEX_PASSWORD) || password.length > config.LEN_PASSWORD ||
        !username.match(config.REGEX_USERNAME) || username.length > config.LEN_USERNAME) {

        res.status(413).json({
            success: false,
            error: "Wrong data sent! (3)"
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
            db.db.query('INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version) VALUES (DEFAULT, $1, $2, $3, $4, $5, true, NOW(), NULL, 1)', [accountType, firstname, lastname, username, password])
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
    var payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    // Checking if data is valid before sending it to remote DB server
    if (accountType === '0' || accountType === '1' || accountType === '2' || accountType === '3') {
        res.status(412).json({
            success: false,
            error: "Wrong data sent! (1)"
        })
        return
    }

    if (payload.user.account_type === 2 || payload.user.account_type === 3) {
        // not allowed to
        res.status(500).send();
        return;
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
    var payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // checks if user is the admin
    if (payload.user.account_type === 0) {
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

    } else {
        // not the admin
        res.status(500);
    }
});

router.post("/updateAccount", function (req, res, next) {

    var id = req.body.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;

    var payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // checks if user is the admin
    if (payload.user.account_type === 0) {
        // checking if the id is an int
        if (id !== parseInt(id, 10)) {
            res.status(412).json({
                success: false,
                error: "Wrong data sent! (1)"
            })
            return
        }

        // Checking what we have to update depending on what the client sent us

        // Updating firstname lastname and password
        if (firstname && lastname && password) {
            // update all
            if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME || !lastname.match(config.REGEX_NAME) ||
                lastname.length > config.LEN_NAME || !password.match(config.REGEX_PASSWORD) || password.length > config.LEN_PASSWORD) {

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
                    db.db.query('UPDATE savingjim.users SET first_name=$1, last_name=$2, password=$3 WHERE id=$4', [firstname, lastname, password, id])
                        .then(result => {
                            if (result) {
                                res.status(200).json({
                                    success: true
                                })
                            } else {
                                res.status(401).json({
                                    success: false,
                                    error: "Error (4)"
                                })
                            }

                        })
                        .catch(e => console.error(e.stack))
                    return;
                }
            });
            return;
        }

        // Updating firstname and lastname
        if (firstname && lastname) {
            if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME || !lastname.match(config.REGEX_NAME) ||
                lastname.length > config.LEN_NAME) {

                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
                })
                return
            }
            db.db.query('UPDATE savingjim.users SET first_name=$1, last_name=$2 WHERE id=$3', [firstname, lastname, id])
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            success: true
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            error: "Error (4)"
                        })
                    }

                })
                .catch(e => console.error(e.stack))
            return;
        }

        if (firstname && password) {
            if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME || !password.match(config.REGEX_PASSWORD) ||
                password.length > config.LEN_PASSWORD) {

                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
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
                    db.db.query('UPDATE savingjim.users SET first_name=$1, password=$2 WHERE id=$3', [firstname, password, id])
                        .then(result => {
                            if (result) {
                                res.status(200).json({
                                    success: true
                                })
                            } else {
                                res.status(401).json({
                                    success: false,
                                    error: "Error (4)"
                                })
                            }

                        })
                        .catch(e => console.error(e.stack))
                    return;
                }
            });
        }


        if (lastname && password) {
            if (!lastname.match(config.REGEX_NAME) || lastname.length > config.LEN_NAME || !password.match(config.REGEX_PASSWORD) ||
                password.length > config.LEN_PASSWORD) {

                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
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
                    db.db.query('UPDATE savingjim.users SET last_name=$1, password=$2 WHERE id=$3', [lastname, password, id])
                        .then(result => {
                            if (result) {
                                res.status(200).json({
                                    success: true
                                })
                            } else {
                                res.status(401).json({
                                    success: false,
                                    error: "Error (4)"
                                })
                            }

                        })
                        .catch(e => console.error(e.stack))
                    return;
                }
            });
        }

        if (firstname) {
            if (!firstname.match(config.REGEX_NAME) || firstname.length > config.LEN_NAME) {
                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
                })
                return
            }
            db.db.query('UPDATE savingjim.users SET first_name=$1 WHERE id=$2', [firstname, id])
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            success: true
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            error: "Error (4)"
                        })
                    }

                })
                .catch(e => console.error(e.stack))
            return;
        }
        if (lastname) {
            if (!lastname.match(config.REGEX_NAME) || lastname.length > config.LEN_NAME) {
                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
                })
                return
            }
            db.db.query('UPDATE savingjim.users SET last_name=$1 WHERE id=$2', [lastname, id])
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            success: true
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            error: "Error (4)"
                        })
                    }

                })
                .catch(e => console.error(e.stack))
            return;
        }

        if (password) {
            if (!password.match(config.REGEX_PASSWORD) ||
                password.length > config.LEN_PASSWORD) {
                res.status(413).json({
                    success: false,
                    error: "Wrong data sent! (3)"
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
                    db.db.query('UPDATE savingjim.users SET password=$1 WHERE id=$2', [password, id])
                        .then(result => {
                            if (result) {
                                res.status(200).json({
                                    success: true
                                })
                            } else {
                                res.status(401).json({
                                    success: false,
                                    error: "Error (4)"
                                })
                            }

                        })
                        .catch(e => console.error(e.stack))
                    return;
                }
            });
        }

        // if everything is null then we don't update anything
        res.status(401).json({
            success: false,
            error: "Error No parameter given"
        })
    } else {
        // not the admin
        res.status(500);
    }
});

router.post("/statistics", function (req, res, next) {
    var payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // checks if user is the admin
    if (payload.user.account_type === 0) {
        db.db.query('SELECT account_type, COUNT(id) FROM savingjim.users GROUP BY account_type ORDER BY account_type ASC')
            .then(result => {
                if (result) {
                    var xd = result.rows;
                    res.status(200);
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
    } else {
        // not the admin
        res.status(500);
    }
});
module.exports = router;