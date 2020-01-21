const express  = require('express');
const router   = express.Router();
const fs = require('fs');
const serverConfig = require('../config/server.json');
const projectConfig = require('../config/project');

router.get('/', (req, res) => {

    let project = req.query.project;

    console.log(`REQUEST GET /info ${project}`);

    if(project === 'pipeline-test/pipeline') {

        let projectInfo = projectConfig.info['pipeline-test/pipeline'];

        let caseFile = serverConfig.path + projectInfo['casePath'];
        delete projectInfo['casePath'];

        let caseText = fs.readFileSync(caseFile, 'utf8');
        projectInfo['case'] = caseText;

        res.writeHead(200);
        res.end(JSON.stringify(projectInfo));

    } else { // project is wrong

        res.writeHead(400);
        res.end();

    }

});

module.exports = router;
