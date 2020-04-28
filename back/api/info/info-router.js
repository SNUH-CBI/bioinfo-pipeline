const express   = require('express');
const infoLogic = require('./info-logic');

const router = express.Router();

router.get('/', infoLogic.get);

module.exports = router;
