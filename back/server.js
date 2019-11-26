// server.js
var express    = require('express');
var app        = express();
var session    = require('express-session');
var bodyParser =  require('body-parser');

// Middlewares
app.use(session({
  // TODO: change secret-key to env
  secret: "xcp12a!@^xvcx!@#zxc",
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 1000} // expire 1 hour
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
app.use('/path', require('./api/directory'));
app.use('/remove', require('./api/remove'));

// Server
var port = 4000;
app.listen(port, function(){
  console.log('listening on port: ' + port);
});
