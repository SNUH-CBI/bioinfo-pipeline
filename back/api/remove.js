// api/remove.js

// ONLY FOR TEST
var express  = require('express');
var router   = express.Router()

// Show
router.post('/',
  function(req, res){
    req.session.user = undefined;
    res.json({sucesss: true});
  } 
);

module.exports = router