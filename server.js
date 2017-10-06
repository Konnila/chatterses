const express = require('express');
const fs = require('fs');
const sqlite = require('sql.js');
const io = require('socket.io')();
const http = require('http');

const filebuffer = fs.readFileSync('db/usda-nnd.sqlite3');

const app = express();



var mongoose = require('mongoose');
const dbaddr = 'mongodb://conels:conels123@ds040167.mlab.com:40167/chatter-db';

mongoose.connect(dbaddr, {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var server = http.createServer(app);

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


io.on('connection', function(socket){
  socket.on('message', function(msg, user){
    console.log('message: ' + msg + " user: " + user);
    io.emit('message', msg, user);
  });
});


//routes
var routes_channels = require('./routes/channels');
app.use('/channels', routes_channels);

// app.get('/channels', function (req, res) {
//   res.send('channels')
// });


io.listen(server);
server.listen(app.get('port'));
console.log(`Find the server at: http://localhost:${app.get('port')}/`);

