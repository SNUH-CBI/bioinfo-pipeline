const express        = require('express');
const dirController  = require('./directory-controller');
const authController = require('./authorization-controller');
const projectConfig  = require('../config/project');

const router = express.Router();

router.get('/', (req, res) => {

    let project = req.query.project;
    let menu = req.query.menu;

    console.log(`REQUEST GET /directory ${project} ${menu}`);

    if(project === 'pipeline-test/pipeline') {

        if(!authController.checkAuth(project, req, res)) return;

        if(projectConfig.api[menu] !== undefined) {

            let result = dirController.pipelineDirectory(menu);
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
