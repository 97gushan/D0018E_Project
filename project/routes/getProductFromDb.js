var express = require('express');
var router = express.Router();
var DB = require('../Database.js');
var bodyparser= require("body-parser");
/* GET users listing. */
router.get('/', function(req, res, next) {

    DB.getProductFromDb();
});

module.exports = router;
