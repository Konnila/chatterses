 var Channel = require('../db/models/channel');

exports.get_channels = function(req, res) {
    Channel.find({}).then(c => res.json(c));
};

exports.add_channel = function(req, res) {
    var channel = new Channel(
        { name: req.body.name, description: req.body.description, created_at: new Date() }
      );

      channel.save(function (err) {
        if (err)
            res.send(err); 
        
        res.send(req.body);   

      });
};