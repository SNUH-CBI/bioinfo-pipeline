const express   = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ title: 'bioinfo-pipeline-back' })
});

router.use('/auth', require('./auth/authorization-router'));

router.use('/directory', require('./directory/directory-router'));

router.use('/info', require('./info/info-router'));

export default router;
