// api/directory.js
var express  = require('express');
var router   = express.Router();
var json     = require('./example.json');

// Show
router.post('/:path*',
  function(req, res){
    if (req.session.user === req.params.path){
      // TODO: search directory
      res.json({sucesss: true, result: json})
    }
    else
      res.json({success: false})
  } 
);

module.exports = router