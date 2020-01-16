// api/directory.js
var express  = require('express');
var router   = express.Router();

// Show
router.get('/*',
  function(req, res){
    res.json({success: true, result: {
      "project": req.query.project,
      "menu": req.query.menu
    }})
  } 
);

module.exports = router
