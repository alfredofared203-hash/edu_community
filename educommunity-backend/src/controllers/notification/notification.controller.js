const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} = require('../../services/notification/notification.service');


async function getNotifications(req, res) {
  const { page = 1, limit = 20 } = req.query;
  try {
    const result = await getUserNotifications({
      userId: req.user.id,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result); 
  } catch (e) {
    console.error('خطأ في جلب الإشعارات:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الإشعارات' });
  }
}


async function readNotification(req, res) {
  try {
    const notification = await markAsRead({ notificationId: req.params.id, userId: req.user.id });
    if (!notification) return res.status(404).json({ error: 'الإشعار غير موجود' });
    res.json({ notification });
  } catch (e) {
    console.error('خطأ في تعليم الإشعار كمقروء:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث الإشعار' });
  }
}


async function readAllNotifications(req, res) {
  try {
    await markAllAsRead(req.user.id);
    res.json({ ok: true });
  } catch (e) {
    console.error('خطأ في تعليم كل الإشعارات كمقروءة:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث الإشعارات' });
  }
}

module.exports = { getNotifications, readNotification, readAllNotifications };
