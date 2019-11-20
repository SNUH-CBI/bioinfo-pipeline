// server.js
var express    = require('express');
var app        = express();

// Middlewares

// API
app.get('/', (req, res) => {
  res.json({
    title: 'bioinfo-pipeline-back'
  })
})

// Server
var port = 4000;
app.listen(port, function(){
  console.log('listening on port: ' + port);
});
