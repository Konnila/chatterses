var express = require('express');
var router = express.Router();

var channel_controller = require('../controllers/channelController');

/* GET catalog home page. */
router.get('/', channel_controller.get_channels);

module.exports = router;