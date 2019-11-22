// api/authorization.js
var express  = require('express');
var router   = express.Router()

const check = (path, password) => {
  // TODO : set password
  return path===password;
}

// Show
router.post('/:path',
  function(req, res){
    if (check(req.params.path, req.body.password)){
      // TODO: req session uuid 
      req.session.user = req.params.path
      { res.json( {success: true} )}
    }
    else { res.json( {success: false} )}
  } 
);

module.exports = router