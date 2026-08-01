const router = require('express').Router();
const ctrl = require('../../controllers/reward.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/',           ctrl.list);                                          // الكل
router.get('/me',         ctrl.myRewards);                                     // مكافآت المستخدم الحالي
router.get('/users',      authorize('admin'), ctrl.usersWithRewards);          // أدمن: كل المستخدمين + مكافآتهم
router.post('/',          authorize('admin'), ctrl.create);                    // أدمن: إنشاء مكافأة
router.delete('/:id',     authorize('admin'), ctrl.remove);                    // أدمن: حذف مكافأة
router.post('/:userId/:rewardId',   authorize('admin'), ctrl.grant);           // أدمن: منح
router.delete('/:userId/:rewardId', authorize('admin'), ctrl.revoke);          // أدمن: إلغاء

module.exports = router;
