var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/admin', function(req, res, next) {
  res.render('adminPanel', { title: 'Express' });
});

router.get('/register', function(req,res,nexy){
  res.render('registerPanel');
});

module.exports = router;
