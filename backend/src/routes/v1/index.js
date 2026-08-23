const router = require('express').Router();

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====

router.use('/auth', require('../auth'));
router.use('/materials', require('../materials'));
router.use('/tasks', require('./softskill.routes'));
router.use('/chat', require('./chat'));
router.use('/softskills', require('./softskill.routes'));
router.use('/challenges', require('../challenge.routes'));
router.use('/rewards', require('./reward.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/recommendations', require('./recommendation.routes'));
router.use('/analytics', require('./analytics.routes'));

module.exports = router;