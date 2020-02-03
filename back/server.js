const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const utility       = require('./utility');
const serverConfig  = require('./config/server.json');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: serverConfig.cors,
    credentials: true
}));
app.use(session({
    secret: serverConfig.secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 3 * 60 * 60 * 1000} // expire 3 hour
}));

// API
app.get('/', (req, res) => {
    res.json({
        title: 'bioinfo-pipeline-back'
    })
});
app.use('/auth', require('./api/auth/authorization-router'));
app.use('/directory', require('./api/directory/directory-router'));
app.use('/info', require('./api/info/info-router'));

// Server
app.listen(serverConfig.port, () => utility.print(`listening on port: ${serverConfig.port}`));
