const express           = require('express');
const fs                = require('fs');
const authController    = require('./authorization-controller');
const serverConfig      = require('../config/server');
const projectConfig     = require('../config/project');

const router = express.Router();

router.get('/', (req, res) => {

    let project = req.query.project;

    console.log(`REQUEST GET /info ${project}`);

    if(projectConfig.project.includes(project)) {

        if(!authController.checkAuth(project, req, res)) return;

        let projectInfo = projectConfig.info[project];
        let result = Object.assign({}, projectInfo);

        let caseFile = serverConfig.path + projectInfo['casePath'];
        result['case'] = fs.readFileSync(caseFile, 'utf8');
        delete result['casePath'];

        res.json(result);

    } else { // project is wrong

        res.writeHead(400);
        res.end();

    }

});

module.exports = router;
