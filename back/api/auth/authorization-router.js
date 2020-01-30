const express           = require('express');
const utility           = require('../../utility');
const authController    = require('./authorization-controller');

const router = express.Router();

router.post('/', (req, res) => {

    const project = req.query.project;
    const password = req.body.password;

    // check parameters
    if(project === undefined || password === undefined) {
        res.writeHead(400);
        res.end();
        return;
    }

    utility.print(`GET /auth ${project}`);

    if(authController.checkPassword(project, password)) {

        req.session.project = project;

        req.session.save(() => {

            res.json({
                'success' : true
            });

        });

    } else {

        res.json({
            'success' : false
        });

    }

});

module.exports = router;
