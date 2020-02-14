const projectConfig  = require('../../config/project.json');

// Compare password with config json
const checkPassword = (project, password) => {

    return projectConfig.password[project] === password;

};

// Check if API request has correct session
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
