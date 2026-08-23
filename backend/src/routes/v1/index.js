const router = require('express').Router();

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====

router.use('/auth', require('../auth')); 
router.use('/materials', require('../materials')); 
router.use('/tasks', require('./softskill.routes')); 
router.use('/chat', require('./chat'));
router.use('/softskills', require('./softskill.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/recommendations', require('./recommendation.routes'));
router.use('/analytics', require('./analytics.routes'));  
// المزايا الجديدة (المرحلة 3 وما بعدها) بتتركّب هنا بالمعمار الطبقي.
// المسارات القديمة (auth/materials/...) لسه على /api زي ما هي في server.js.

router.use('/auth', require('../auth'));                    // نفس مسارات المصادقة متاحة تحت v1 كمان (للتجديد)
router.use('/chat', require('./chat'));
router.use('/challenges', require('../challenge.routes'));
router.use('/softskills', require('./softskill.routes'));
router.use('/rewards',    require('./reward.routes'));  // المهارات الناعمة + التسليمات
router.use('/notifications', require('./notification.routes')); // الإشعارات
router.use('/recommendations', require('./recommendation.routes')); // ترشيح المدرسين

module.exports = router;