const express   = require('express');
const authLogic = require('./authorization-logic');

const router = express.Router();

router.post('/', authLogic.post);

module.exports = router;
