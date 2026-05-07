const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/:userId', verifyToken, messageController.getMessages);
router.post('/', verifyToken, messageController.sendMessage);
router.delete('/:id', verifyToken, messageController.deleteMessage);
router.put('/:userId/read', verifyToken, messageController.markAsRead);
router.get('/unread/count', verifyToken, messageController.getUnreadCount);

module.exports = router;
