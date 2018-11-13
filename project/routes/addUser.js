
var express = require('express');
var router = express.Router();
var DB = require('../Database.js');
/* GET users listing. */
router.get('/', function(req, res, next) {

    DB.addUserToDB();
    res.send('<h1>respond with a resource</h1>');
});

module.exports = router;
