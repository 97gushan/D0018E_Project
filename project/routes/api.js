var express = require('express');
var session = require('express-session');
var router = express.Router();
var DB = require('../Database.js');
var bodyparser= require("body-parser");
var bcrypt = require('bcrypt');


router.use(bodyparser.json());

/* Add product to DB */
router.post('/product/add', function(req, res, next) {
    console.log(req);
    console.log(req.body.produkt);
    var product = req.body.product;
    var price = req.body.price;
    var amount = req.body.amount;
    var description = req.body.description;
    DB.addProductToDB(product, price, amount, description, "things");
    res.send('<h1>respond with a resource</h1>');
    
});

/* Add user to DB */
router.post('/user/add', function(req, res, next) {

    var name = req.body.name;
    var pass = req.body.password;
    
    // Hash password
    bcrypt.hash("pass", 1, function(err, hash){
        DB.addUser(name, hash, 0, 0);
    });
    
    res.send('<h1>respond with a resource</h1>');
    
});

//Login user
router.post('/user/login', function(req, res, next) {

    var name = req.body.name;
    var pass = req.body.password;
    
    DB.loginUser(name, pass);
    
    
    res.send('<h1>respond with a resource</h1>');
    
});


/* Get product from DB */
router.get('/product/get/', function(req, res, next) {

    DB.getProductFromDb();
    res.send('<h1>respond with a resource</h1>');

});

module.exports = router;
