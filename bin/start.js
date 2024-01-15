'use strict';

require('@babel/register');
require('@babel/polyfill');
const debug = require('debug')('msal:server');
const http = require('http');
// const https = require('https')

const app = require('../app').default; // Assuming this is the path to your app
const config = require('../config');
const configvalue = config.get(process.env.Node_env);
const PORT = configvalue.PORTNO; // Defaulting to 3000 if PORTNO is not set in config
const fs = require('fs')
app.set('port', PORT);
const path = require('path');




const server = http.createServer(app);



server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

var port = normalizePort(configvalue.PORTNO );
app.set('port', port);

function normalizePort(val) {
   var port = parseInt(val, 10);

   if (isNaN(port)) {
       // named pipe
       return val;
   }

   if (port >= 0) {
       // port number
       return port;
   }

   return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Server listening on ' + bind); // New console log to indicate server start
}
