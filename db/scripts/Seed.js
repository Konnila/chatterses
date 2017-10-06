//FIXME: remove hardcode, its ok for now 
const dbaddr = 'mongodb://conels:conels123@ds040167.mlab.com:40167/chatter-db';


const async = require('async');
let Channel = require('../models/channel.js');
let mongoose = require('mongoose');

let mongoDB = dbaddr;
mongoose.connect(mongoDB);
let db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let channels = [];

function createChannel(name, description, cb) {
    const channelDetails = { name:name, description: description, created_at: new Date() };
    let channel = new Channel(channelDetails);

    channel.save(function (err) {
        if (err) {
          cb(err, null)
          return
        }
        console.log('New Channel: ' + channel);
        channels.push(channel);
        cb(null, channel);
      }  );
}

function createChannels(cb) {
    async.parallel([
        function(callback) {
            createChannel('Random', "Random discussion",callback);
        },
        function(callback) {
            createChannel("News", "what's up in the world", callback);
        },
        function(callback) {
            createChannel("Development", "Meet other developers", callback);
        }
    ], cb)
    
}

//the root call
async.series([
    createChannels
], 
function(err, results) {
    if (err) {
        console.log('Error occurred');
    }
    else {
        console.log('Success');
        
    }
    mongoose.connection.close();
});