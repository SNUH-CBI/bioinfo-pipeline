// server.js
var express    = require('express');
var app        = express();
var session    = require('express-session');
var bodyParser = require('body-parser');
var cors       = require('cors')

const config = require('./config.json');
const server = config.server;

// Middlewares
app.use(cors({
  origin: server.cors,
  credentials: true
}))

app.use(session({
  secret: server.secret_key,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 60 * 60 * 1000} // expire 1 hour
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API
app.get('/', (req, res) => {
  res.json({
    title: 'bioinfo-pipeline-back'
  })
})
app.use('/auth', require('./api/authorization'));
app.use('/directory', require('./api/directory'));
app.use('/remove', require('./api/remove'));

// Server
app.listen(server.port, function(){
  console.log('listening on port: ' + server.port);
});
