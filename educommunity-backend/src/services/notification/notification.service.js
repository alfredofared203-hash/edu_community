const Notification = require('../../models/Notification');

// نحفظ إشعاراً جديداً ونرجّعه
async function createNotification({ recipient, type, content, relatedId = null }) {
  const notification = await Notification.create({ recipient, type, content, relatedId });
  return notification;
}

// نجيب إشعارات المستخدم مع pagination
async function getUserNotifications({ userId, page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ recipient: userId }),
  ]);
  return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// نعلّم إشعاراً واحداً كمقروء
async function markAsRead({ notificationId, userId }) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
  return notification;
}

// نعلّم كل إشعارات المستخدم كمقروءة
async function markAllAsRead(userId) {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
}

module.exports = { createNotification, getUserNotifications, markAsRead, markAllAsRead };
