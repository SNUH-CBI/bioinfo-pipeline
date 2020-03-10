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

        // read from file
        const caseFile = serverConfig.path + projectInfo['sampleInfo'];
        const infoText = fs.readFileSync(caseFile, 'utf8');
        const infoTextSplit = infoText.split('\n');

        let infoList = {};

        infoTextSplit.forEach(text => {
            if(!text.includes('\t')) return;

            const textSplit = text.split('\t');
            const sampleCategory = textSplit[1];
            const sampleName = textSplit[0];

            if(!(sampleCategory in infoList)) infoList[sampleCategory] = [];

            infoList[sampleCategory].push(sampleName);
        });

        // create result object
        result = Object.assign({}, projectInfo);
        delete result['sampleInfo'];
        result['info'] = infoList;

        res.json(result);

    } else { // project is wrong

        res.writeHead(400);
        res.end();

    }

});

module.exports = router;
