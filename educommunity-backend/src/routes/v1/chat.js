const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const { getMessageHistory, getDMConversation } = require('../../controllers/chat/chat.controller');


router.get('/messages', authenticate, getMessageHistory);

router.get('/dm', authenticate, getDMConversation);

module.exports = router;
