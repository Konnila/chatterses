var Message = require('../db/models/message');

exports.get_messages = function(req,res) {
    // What about if find() fails? There is no error handler. You
    // could add error case handler as a second parameter of then()
    // or chain this with .catch() which catches all errors, but it
    // will also catch all other errors. Therefore, adding an error
    // case handler as a second parameter of then() is preferred.
    Message.find({channel: req.params.channel}).then(m => res.json(m));
};

exports.add_message = function(req, res) {
    // How to ensure that user input is valid?
    var message = new Message({
        message: req.body.message,
        user: req.body.user,
        channel: req.body.channel,
        created_at: new Date()
    });

    message.save(function (err) {
        // Here you have a poor man's error handling policy.
        // The caller cannot distinct if the response
        // is errornous or not because this will send it with
        // OK status.
        if (err)
            res.send(err);

        // This is OK response but it looks the same as
        // error case. Also, in case of an error, this will
        // try to send the response again which is not good.
        res.send(req.body);
      });
    // ^ indentation is wrong.
}
