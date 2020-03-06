// server.js

const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const LOCAL_ENV = 'local';

// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default
// Heroku port
const PORT = process.env.PORT || 8080;
let server;

if (process.env.ENV === LOCAL_ENV) {
  const options = {
    key: fs.readFileSync('./https/private.key'),
    cert: fs.readFileSync('./https/primary.crt')
  };

  server = https.createServer(options, app).listen(PORT);
} else {
  server = app.listen(PORT);
}

server.on('listening', () => {
  console.log('Listening on https://localhost:' + PORT)
});
