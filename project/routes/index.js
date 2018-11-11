var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Super Mega Webbshop of DOOOM'});
});

module.exports = router;
