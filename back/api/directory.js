// api/directory.js
var express  = require('express');
var router   = express.Router();
let dirController = require('./directory-controller');
let projectConfig = require('../config/project');

// Show
router.get('/', (req, res) => {

    let project = req.query.project;
    let menu = req.query.menu;

    console.log(`REQUEST GET /directory ${project} ${menu}`);

    if(project === 'pipeline-test/pipeline') {

        if(projectConfig.api[menu] !== undefined) {

            let result = dirController.pipelineDirectory(menu);

            res.writeHead(200);
            res.end(JSON.stringify(result));

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
