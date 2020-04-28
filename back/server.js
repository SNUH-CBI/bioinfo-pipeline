const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const api           = require('./api/api');
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
app.use('/', api);

// Server
app.listen(serverConfig.port, () => utility.print(`listening on port: ${serverConfig.port}`));
