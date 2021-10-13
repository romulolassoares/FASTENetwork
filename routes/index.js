var express = require('express');
var router = express.Router();
const mongodb = require('../app/database/mongodb/Server')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{
    css: ''
  });
});

router.get('/cadastrarRede', function(req, res, next) {
  res.render('cadastrarRede',{
    css: ''
  });
});

router.get('/listarRedes', function(req, res, next) {
  res.render('listarRedes',{
    css: ''
  });
});

router.get('/result', function(req, res, next) {
  res.render('result',{
    css: ''
  });
});

router.get('/resultDelete', function(req, res, next) {
  res.render('resultDelete',{
    css: ''
  });
});


module.exports = router;
