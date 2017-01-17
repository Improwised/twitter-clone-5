var express = require('express');
var router = express.Router();

// GET: /
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Hello, World!'
  });
});

module.exports = router;
