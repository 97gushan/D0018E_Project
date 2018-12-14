var express = require('express');
var router = express.Router();
var DB = require('../Database.js');


/* ------------------------------------ */
/* ---------- USER HANDLING ----------- */
/* ------------------------------------ */


/* Add user to DB */
router.post('/user/add', function(req, res, next) {
    DB.addUser(req, res, next, hash, 0, 0);
});

/* Login user */
router.post('/user/login', function(req, res, next) {
    DB.loginUser(req, res, next);
});

/* Logout user by destroying its session*/
router.get('/user/logout/', requireLoggedIn, function(req,res,next){
    req.session.destroy();
    res.redirect('/');
});


/* ------------------------------------ */
/* ---------- Product routes ---------- */
/* ------------------------------------ */

/* Get product from DB */
router.get('/product/get/', function(req, res, next) {
    DB.getProductFromDb(req, res, next);
});

/* Get the reviews for a specific item from the database */
router.get('/product/getReviewsForItem', function(req, res, next) {
    DB.getReviewsForItem(req, res, next);
});

/* Delete product from DB */
router.post('/product/delete/', requireAdmin, function(req, res, next) {
    DB.deleteProductFromDb(req, res, next);
});

/* Restore deleted product from DB */
router.post('/product/restore/', requireAdmin, function(req, res, next) {
    DB.restoreProductFromDb(req, res, next);
});

/* Add product to DB */
router.post('/product/add', requireAdmin, function(req, res, next) {
    DB.addProductToDB(req, res, next);
});

/* Add product to table shopping_basket */
router.post('/product/addToBasket/', requireLoggedIn, function(req, res, next) {
    DB.addToShoppingBasket(req, res, next);
});

/* Fetch the shopping basket */
router.get('/product/getShoppingBasket', requireLoggedIn, function(req, res, next) {
    DB.getShoppingBasket(req, res, next);
});

/* Remove an item from the shopping basket */
router.post('/product/deleteShoppingBasketItem', requireLoggedIn, function(req, res, next) {
    DB.deleteShoppingBasketItem(req, res, next);
});

/* Add a new review to a product */
router.post('/product/addReviewToItem', requireLoggedIn, function(req, res, next) {
    DB.addReviewToItem(req, res, next);
});

/* ------------------------------------ */
/* ---------- ORDER HANDLING ---------- */
/* ------------------------------------ */

/* Place a new order */
router.post('/order/placeOrder', requireLoggedIn, function(req, res, next){        
    DB.placeOrder(req, res, next);
});

/* Get a order */
router.get('/order/getOrder', requireLoggedIn, function(req, res, next) {
    DB.getOrders(req, res, next);
});

/* Change status of an order */
router.post('/order/changeStatus', requireAdmin, function(req, res, next) {
    DB.editOrderStatus(req, res, next);
});

/* Delete a specific order */
router.post('/order/deleteOrder', requireAdmin,  function(req, res, next) {
    DB.deleteOrder(req, res, next);
});


module.exports = router;


/* Functions for checking whether user is authorized for specific action
    they want to do. Call these in api to check for it. */
function requireAdmin(req, res, next){
    if(!req.session.adminFlag)
        res.sendStatus(403);
    else
        next();
}

function requireLoggedIn(req, res, next){
    if(!req.session.userID)
        res.sendStatus(403);
    else
        next();
}