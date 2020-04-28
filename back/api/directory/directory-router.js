const express   = require('express');
const dirLogic  = require('./directory-logic');

const router = express.Router();

router.post('/', dirLogic.post);

module.exports = router;
