const router = require('express').Router();
const ctrl = require('../../controllers/reward.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/',           ctrl.list);                                          // الكل
router.get('/me',         ctrl.myRewards);                                     // مكافآت المستخدم الحالي
router.get('/users',      authorize('admin'), ctrl.usersWithRewards);          // أدمن: كل المستخدمين + مكافآتهم
router.post('/',          authorize('admin'), ctrl.create);                    // أدمن: إنشاء مكافأة
router.delete('/:id',     authorize('admin'), ctrl.remove);                    // أدمن: حذف مكافأة
router.post('/grant',               authorize('admin'), ctrl.grant);           // أدمن: منح { userId, rewardId }
router.post('/revoke',              authorize('admin'), ctrl.revoke);          // أدمن: إلغاء { userId, rewardId }
router.post('/:userId/:rewardId',   authorize('admin'), ctrl.grant);
router.delete('/:userId/:rewardId', authorize('admin'), ctrl.revoke);

module.exports = router;
