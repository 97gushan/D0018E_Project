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

    DB.loginUser(req, res, next);

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
router.post('/product/delete/', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);


    DB.deleteProductFromDb(req, res, next);

});

/* Add product to table shopping_basket */
router.post('/product/addToBasket/', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);


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

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);

  DB.getShoppingBasket(req, res, next);

});

/* Get the reviews for a specific item from the database */
router.get('/product/getReviewsForItem', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);

    DB.getReviewsForItem(req, res, next);

});

/* Add a new review to a product */
router.post('/product/addReviewToItem', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);

    DB.addReviewToItem(req, res, next);

});


router.post('/order/placeOrder', function(req, res, next){

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);
        
    //console.log(req.session.userID);
    DB.placeOrder(res, req.session.userID);

});

router.get('/order/getOrder', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);
    

    DB.getOrders(req, res, next);
  
});

router.post('/order/changeStatus', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);

    var status = req.body.status;
    var orderID = req.body.orderID;
    DB.editOrderStatus(res, status, orderID);
  
});

router.post('/order/deleteOrder', function(req, res, next) {

    // Check if the user exists or if theyre authorized
    if(!req.session.userID)
        return requestUnauthorized(res);

    var orderID = req.body.orderID;
    DB.deleteOrder(res, orderID);
  
});

module.exports = router;


//Call when request isnt authorized
function requestUnauthorized(res){
    res.sendStatus(403);
}