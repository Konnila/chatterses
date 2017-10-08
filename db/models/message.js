var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const MessageSchema = Schema(
    {
        message: {type: String, required: true, max: 1000},
        channel: {type: String, required: true, max: 50},
        user: {type: String, required: false, max: 50},
        created_at: {type: Date}
    }
);

module.exports = mongoose.model('Message', MessageSchema);