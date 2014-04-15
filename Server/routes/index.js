var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/getList', function(req,res){
   res.render("getList", {   data: 'data' });
});


module.exports = router;
