var express = require("express");
var router = express.Router();
const db = require("../modules/db");

router.get("/", function (req, res) {
    console.log(db.db.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        db.db.end()
    }));
    res.status(200).send();
});

router.post("/", function (req, res) {
    console.log(db.db.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        db.db.end()
    }));
    res.status(200).send();
});

module.exports = router;