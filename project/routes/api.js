var express = require('express');
var session = require('express-session');
var router = express.Router();
var DB = require('../Database.js');
var bodyparser= require("body-parser");
var bcrypt = require('bcrypt');


router.use(bodyparser.json());

/* Add product to DB */
router.post('/product/add', function(req, res, next) {
    var product = req.body.product;
    var price = req.body.price;
    var amount = req.body.amount;
    var description = req.body.description;
    DB.addProductToDB(req, res, next, product, price, amount, description, "things");
});

/* Add user to DB */
router.post('/user/add', function(req, res, next) {

    var name = req.body.name;
    var pass = req.body.password;
    
    // Hash password
    bcrypt.hash("pass", 1, function(err, hash){
        DB.addUser(req, res, next, name, hash, 0, 0);
    });
});

//Login user
router.post('/user/login', function(req, res, next) {

    var name = req.body.name;
    var pass = req.body.password;
    
    DB.loginUser(req, res, next,name, pass);
    
    
});

router.get('/user/logout/', function(req,res,next){
    //console.log("Kakor!")
    //console.log(session.userID);
    session.userID = -1;
    //console.log(session.userID);
    res.send('<h1> WWSAD </h1>');
  });

/* Get product from DB */
router.get('/product/get/', function(req, res, next) {

    
    DB.getProductFromDb(req, res, next);
    
});

module.exports = router;
