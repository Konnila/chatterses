var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ChannelSchema = Schema(
    {
        name: {type: String, required: true, max: 30},
        created_at: {type: Date}
    }
);

module.exports = mongoose.model('Channel', ChannelSchema);

