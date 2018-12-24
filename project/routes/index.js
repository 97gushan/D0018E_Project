var express = require('express');
var router = express.Router();
var session = require('express-session');

var ses;

/* GET home page. */
router.get('/', function(req, res, next) {

  ses = req.session;
  if(ses.username){

    res.render('index', { Username: ses.username, UserID: ses.userID, autheticated: true, admin: ses.adminFlag });

  }else{
    res.render('index', { Username: "user", autheticated: false, admin: 0 });

  }
  

});

module.exports = router;
