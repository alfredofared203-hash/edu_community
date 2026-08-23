const router = require('express').Router();

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====
// المزايا الجديدة (المرحلة 3 وما بعدها) بتتركّب هنا بالمعمار الطبقي.

router.use('/auth', require('./auth.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/materials', require('./material.routes'));
router.use('/chat', require('./chat'));
router.use('/challenges', require('./challenge.routes'));
router.use('/softskills', require('./softSkill.routes'));
router.use('/teachers', require('./teacher.routes'));
router.use('/rewards', require('./reward.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/recommendations', require('./recommendation.routes'));

module.exports = router;
