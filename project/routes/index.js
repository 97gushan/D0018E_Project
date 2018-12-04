var express = require('express');
var router = express.Router();
var session = require('express-session');

var ses;

/* GET home page. */
router.get('/', function(req, res, next) {

  ses = req.session;
  if(ses.username){

    res.render('index', { Username: ses.username, autheticated: true, admin: ses.adminFlag });

  }else{
    res.render('index', { Username: "user", autheticated: false, admin: 0 });

  }
  

});
//productwindow
router.get('/productWindow', function(req, res, next) {


  res.render("productWindow", {id:req.query.id, admin: ses.adminFlag});

});
module.exports = router;
