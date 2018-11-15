
var express = require('express');
var router = express.Router();
var DB = require('../Database.js');
var bodyparser= require("body-parser");

router.use(bodyparser.json());
/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req);
    console.log(req.body.produkt);
    DB.addProductToDB(req.body.produkt, "100", "2", "Stuff", "things");
    res.send('<h1>respond with a resource</h1>');
    
});

module.exports = router;
