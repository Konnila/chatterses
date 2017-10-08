var express = require('express');
var router = express.Router();

var message_controller = require('../controllers/messageController');

// gets
router.get('/:channel', message_controller.get_messages);


// posts
router.post('/add', message_controller.add_message);

module.exports = router;