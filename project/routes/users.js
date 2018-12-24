var express = require('express');
var session = require('express-session');
var router = express.Router();
var DB = require('../Database.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/admin', function(req, res, next) {
  res.render('adminPanel', { title: 'Express' });
});

router.get('/register', function(req,res,next){
  res.render('registerPanel');
});

router.get('/login', function(req,res,next){
  res.render('loginPanel');
});

router.get('/order/:userID/:orderID',requireSameUser, function(req, res, next) {
  DB.getOrderItems(req, res, next);
});

function requireSameUser(req, res, next){
  if(req.params.userID == req.session.userID || req.session.adminFlag)
    next();
  else
    res.sendStatus(403);
    
}


module.exports = router;
