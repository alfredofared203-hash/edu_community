const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const {
  getNotifications,
  readNotification,
  readAllNotifications,
} = require('../../controllers/notification/notification.controller');


router.get('/', authenticate, getNotifications);


router.patch('/read-all', authenticate, readAllNotifications);


router.patch('/:id/read', authenticate, readNotification);

module.exports = router;
