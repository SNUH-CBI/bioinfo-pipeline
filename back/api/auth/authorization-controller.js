const projectConfig  = require('../../config/project.json');

const checkPassword = (project, password) => {

    return projectConfig.password[project] === password;

};

const checkAuth = (project, req, res) => {

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
