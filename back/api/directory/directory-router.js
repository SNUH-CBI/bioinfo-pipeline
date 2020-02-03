const express           = require('express');
const dirController     = require('./directory-controller');
const authController    = require('../auth/authorization-controller');
const utility           = require('../../utility');
const projectConfig     = require('../../config/project.json');

const router = express.Router();

router.get('/', (req, res) => {

    const project = req.query.project;
    const menu = req.query.menu;
    let result;

    // check parameters
    if(project === undefined || menu === undefined) {
        res.writeHead(400);
        res.end();
        return;
    }

    utility.print(`GET /directory ${project} ${menu}`);

    if(project === 'pipeline-test/pipeline') {

        // check session authorization
        if(!authController.checkAuth(project, req, res)) return;

        if(projectConfig.api[menu] !== undefined) { // menu is in list

            result = dirController.pipelineDirectory(menu);
            res.json(result);

        } else { // menu is wrong

            res.writeHead(400);
            res.end();

        }

    } else { // project is wrong

        res.writeHead(400);
        res.end();

    }

});

module.exports = router;
