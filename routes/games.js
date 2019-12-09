/**
 * Load modules
 */

const express = require('express')
const router = express.Router()
const _ = require('lodash')
const db = require('../modules/db')
const config = require('../modules/config')

router.post("/addGame", function (req, res, next) {

    let worker_id = req.body.workerId;
    let child_id = req.body.childId;
    let lines = req.body.data;

    db.db.query('INSERT INTO savingjim.games_open (id, worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (DEFAULT, $1, $2, $3, $4, NULL, NULL, 0);', [worker_id, child_id, Date.now(), lines])
        .then(result => {
            if (result) {
                res.status(200).json({
                    success: true
                })
            } else {
                res.status(500).json({
                    success: false,
                    error: "Cannot add a game"
                })
            }
        }).catch(err => console.error(err));
});

router.get('/allGames', function (req, resp) {
    db.db.query('SELECT id, worker_id, child_id, date, data, modified_by, modified_on, version FROM savingjim.games_open')
        .then(result => {
            if (result) {
                res.status(200).json({
                    success: true
                })
            } else {
                res.status(500).json({
                    success: false,
                    error: "cannot select all games"
                })
            }
        }).catch(err => {
            console.error(err)
        });
});

//Get all the games for a specific child
router.get("/childGame", function (req, res) {

    let child_id = req.body.childId;

    db.db.query('SELECT id, worker_id, child_id, date, data, modified_by, modified_on, version FROM savingjim.games_open WHERE child_id = $1', [child_id])
        .then(result => {
            if (result) {
                res.status(200).json({
                    success: true,
                    games: result
                })
            } else {
                res.status(500).json({
                    success: false,
                    error: "Cannot get child games"
                })
            }
        }).catch(err => {
            console.error(err)
        });
})


module.exports = router;