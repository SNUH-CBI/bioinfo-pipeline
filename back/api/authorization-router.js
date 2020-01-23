const express        = require('express');
const authController = require('./authorization-controller');

const router = express.Router();

router.post('/', (req, res) => {

    let project = req.query.project;
    let password = req.body.password;

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
