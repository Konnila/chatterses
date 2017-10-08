var Message = require('../db/models/message');

exports.get_messages = function(req,res) {
    console.log(req.params);
    Message.find({channel: req.params.channel}).then(m => res.json(m));
};

exports.add_message = function(req, res) {
    console.log(req.body);
    console.log("adding message");

    var message = new Message({
        message: req.body.message,
        user: req.body.user,
        channel: req.body.channel,
        created_at: new Date()
    });

    message.save(function (err) {
        if (err) 
            res.send(err); 
        
        res.send(req.body);   
      });
}