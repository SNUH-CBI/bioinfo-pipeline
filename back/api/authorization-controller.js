const projectConfig  = require('../config/project');

let checkPassword = (project, password) => {

    return projectConfig.password[project] === password;

};

let checkAuth = (project, req, res) => {

    if(req.session.project === project) {

        return true;

    } else {

        res.writeHead(401);
        res.end();

        return false;

    }

};

module.exports = {

    checkPassword : checkPassword,
    checkAuth : checkAuth

};
