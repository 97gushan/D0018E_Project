var express = require('express');
var router = express.Router();
var DB = require('../Database.js');
var bcrypt = require('bcrypt');


/* Add product to DB */
router.post('/product/add', function(req, res, next) {
    var product = req.body.product;
    var price = req.body.price;
    var amount = req.body.amount;
    var description = req.body.description;

    console.log(description);
    DB.addProductToDB(req, res, next, product, price, amount, description, "things");
});

/* Add user to DB */
router.post('/user/add', function(req, res, next) {

    var pass = req.body.password;

    // Hash password
    bcrypt.hash(pass, 1, function(err, hash){
        DB.addUser(req, res, next, hash, 0, 0);
    });
});

//Login user
router.post('/user/login', function(req, res, next) {


    var name = req.body.username;
    var pass = req.body.password;

    DB.loginUser(req, res, next,name, pass);

});

router.get('/user/logout/', function(req,res,next){
    req.session.destroy();
    res.redirect('/');
  });

/* Get product from DB */
router.get('/product/get/', function(req, res, next) {


    DB.getProductFromDb(req, res, next);

});

/* Delete product from DB */
router.get('/product/delete/', function(req, res, next) {


    DB.deleteProductFromDb(req, res, next);

});

/* Add product to table shopping_basket */
router.post('/product/addToBasket/', function(req, res, next) {
    var price = parseInt(req.body.price);
    var amount = parseInt(req.body.amount);
    var product_id = parseInt(req.body.product_id);

    if(req.session.userID){
        var user_id = req.session.userID;
        DB.addToShoppingBasket(req, res, next, price, amount, user_id, product_id);
    }else{
        res.sendStatus(403);
    }
});

router.get('/product/getShoppingBasket', function(req, res, next) {

  DB.getShoppingBasket(req, res, next);

});

/* Get the reviews for a specific item from the database */
router.get('/product/getReviewsForItem', function(req, res, next) {

    DB.getReviewsForItem(req, res, next);

});

/* Add a new review to a product */
router.post('/product/addReviewToItem', function(req, res, next) {


    DB.addReviewToItem(req, res, next);

});


router.post('/order/placeOrder', function(req, res, next){
    if(req.session.userID){
        //console.log(req.session.userID);
        DB.placeOrder(res, req.session.userID);
    }else{
        res.sendStatus(403);
    }
});

router.get('/order/getOrder', function(req, res, next) {

    DB.getOrders(req, res, next);
  
});

router.post('/order/changeStatus', function(req, res, next) {
    var status = req.body.status;
    var orderID = req.body.orderID;
    DB.editOrderStatus(res, status, orderID);
  
});

router.post('/order/deleteOrder', function(req, res, next) {
    var orderID = req.body.orderID;
    DB.deleteOrder(res, orderID);
  
});

module.exports = router;
