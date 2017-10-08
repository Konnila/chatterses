var express = require('express');
var router = express.Router();

var channel_controller = require('../controllers/channelController');

// gets
router.get('/', channel_controller.get_channels);

// posts
router.post('/add', channel_controller.add_channel)

module.exports = router;