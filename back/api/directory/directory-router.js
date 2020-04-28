const express   = require('express');
const dirLogic  = require('./directory-logic');

const router = express.Router();

router.get('/', dirLogic.get);

module.exports = router;
