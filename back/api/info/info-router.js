const express           = require('express');
const fs                = require('fs');
const authController    = require('../auth/authorization-controller');
const utility           = require('../../utility');
const serverConfig      = require('../../config/server.json');
const projectConfig     = require('../../config/project.json');

const router = express.Router();

router.get('/', (req, res) => {

    const project = req.query.project;
    let result;

    // check parameters
    if(project === undefined) {
        res.writeHead(400);
        res.end();
        return;
    }

    utility.print(`GET /info ${project}`);

    if(projectConfig.project.includes(project)) { // project is in list

        // check session authorization
        if(!authController.checkAuth(project, req, res)) return;

        // get project info from config json
        const projectInfo = projectConfig.info[project];
        result = Object.assign({}, projectInfo);

        // read case from file
        const caseFile = serverConfig.path + projectInfo['casePath'];
        result['case'] = fs.readFileSync(caseFile, 'utf8');
        delete result['casePath'];

        res.json(result);

    } else { // project is wrong

        res.writeHead(400);
        res.end();

    }

});

module.exports = router;
