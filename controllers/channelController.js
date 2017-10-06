 var Channel = require('../db/models/channel');

exports.get_channels = function(req, res) {
    Channel.find().then(c => res.json(c));
};