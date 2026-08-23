const router = require('express').Router();

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====
// المزايا الجديدة (المرحلة 3 وما بعدها) بتتركّب هنا بالمعمار الطبقي.

router.use('/auth', require('../auth'));
router.use('/subjects', require('../subjects'));
router.use('/materials', require('../materials'));
router.use('/chat', require('./chat'));
router.use('/tasks', require('./softSkill.routes'));
router.use('/challenges', require('../challenge.routes'));
router.use('/softskills', require('./softSkill.routes'));
router.use('/teachers', require('./teacher.routes'));
router.use('/rewards', require('./reward.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/recommendations', require('./recommendation.routes'));
router.use('/analytics', require('./analytics.routes'));

module.exports = router;
