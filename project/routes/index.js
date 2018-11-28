var express = require('express');
var router = express.Router();
var session = require('express-session');

var ses;

/* GET home page. */
router.get('/', function(req, res, next) {

  ses = req.session;
  if(ses.username){

    res.render('index', { title: ses.username });

  }else{
    res.render('index', { title: "Usr" });

  }
  

});

module.exports = router;
