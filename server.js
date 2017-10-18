const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sqlite = require('sql.js');
const io = require('socket.io')();
const http = require('http');

const app = express();
app.use(bodyParser.json());

var mongoose = require('mongoose');

// This should be in app config (accessible via app.get) and not
// hard-coded here.
const dbaddr = 'mongodb://conels:conels123@ds040167.mlab.com:40167/chatter-db';

mongoose.connect(dbaddr, {
  useMongoClient: true
});

var db = mongoose.connection;

// Using custom function or lambda as an error handler would be more readable.
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var server = http.createServer(app);

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


io.on('connection', function(socket){
  socket.on('message', function(msg, user, channel){
    // String interpolation can be used here,
    // e.g. `message: ${msg}`.
    console.log('message: ' + msg + " user: " + user + " on channel: " + channel);

    // Message msg? Maybe you could use more describing event names.
    io.emit('message', msg, user, channel);
  });
});

  //routes
  var routes_channels = require('./routes/channels');
  var routes_messages = require('./routes/messages');
  app.use('/channels', routes_channels);
  app.use('/messages', routes_messages);

io.listen(server);
server.listen(app.get('port'));
console.log(`Find the server at: http://localhost:${app.get('port')}/`);

