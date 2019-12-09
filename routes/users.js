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

const saltRounds = process.env.SALT_BCRYPT || 10
// To use it in Production, don't forget to set-up a new environment variable
const jwtSecret = process.env.JWT_SECRET



/**
 * Routes
 */

 /* 
account_type
0 = admin
1 = worker
2 = person_of_contact
3 = child
 */

router.post("/user", function (req, res, next) {

    var account_type = req.body.accountType;
    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var user_name = req.body.username;
    var password = req.body.password;

    var user = {account_type, first_name, last_name, user_name, password};
    //Check for null fields and login-pwd matching regex (see /modules/config.js), sends an error if pblm
    if(checkUserFields(user, res)){
        //Check if login is already used.
        db.db.query('SELECT COUNT(username) FROM savingjim.users WHERE username=$1;', [user.user_name])
            .then(result => {
                if(result.rows[0].count === '0'){
                    console.log("username inexistant");
                    bcrypt.genSalt(parseInt(process.env.SALT_BCRYPT)).then(salt => {
                        bcrypt.hash(user.password, salt, function(err, hash){
                            db.db.query('INSERT INTO savingjim.users (account_type, first_name, last_name, username, password, active, modified_on, modified_by, version) VALUES ($1, $2, $3, $4, $5, true, NULL, NULL, 0);',
                                            [user.account_type, user.first_name, user.last_name, user.user_name, hash])
                                .then(result => {
                                    delete user.password;
                                    res.status(200).json({
                                        succes: true,
                                        user: user
                                    });
                                    return
                                }).catch(err => console.error(err));
                        });
                    }).catch(err => console.error(err));
                }else {
                    res.status(400).json({
                        success:false,
                        error: "Username already used"
                    })
                    return
                }
            }).catch(err => console.error(err));
    }
});

let checkUserFields = function(user, res){
    if(!user.password.match(config.REGEX_PASSWORD) || user.password.length > config.LEN_PASSWORD || !user.user_name.match(config.REGEX_USERNAME) || !user.user_name.length > config.LEN_USERNAME){
        res.status(400).json({
            success: false,
            error: "Login or Password invalid"
        })
        return false;
    }
    //Account types are included between (0->3)
    if(user.account_type < 0 || user.account_type > 3){
        res.status(400).json({
            success: false,
            error: "Account type requried"
        })
        return false;
    }

    if(!user.first_name){
        res.status(400).json({
            success: false,
            error: "First name required"
        })
        return false;
    }

    if(!user.last_name){
        res.status(400).json({
            success: false,
            error: "Last name requried"
        })
        return false;
    }

    if(!user.user_name){
        res.status(400).json({
            success: false,
            error: "Login requried"
        })
        return false;
    }

    if(!user.password){
        res.status(400).json({
            success: false,
            error: "Password required"
        })
        return false;
    }
    return true;
}

/**
 * Exports
 */

module.exports = router;