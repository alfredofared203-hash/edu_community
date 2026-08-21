const { getMessages, getDMHistory } = require('../../services/chat/chat.service');

// GET /api/v1/chat/messages?grade=xxx&page=1&limit=20
async function getMessageHistory(req, res) {
  const { grade, page = 1, limit = 20 } = req.query;

  if (!grade) {
    return res.status(400).json({ error: 'يجب تحديد الصف الدراسي' });
  }

  try {
    const result = await getMessages({
      grade,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (e) {
    console.error('خطأ في جلب سجل الرسائل:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسائل' });
  }
}

// GET /api/v1/chat/dm?with=<userId>&page=1&limit=20
async function getDMConversation(req, res) {
  const { with: otherId, page = 1, limit = 20 } = req.query;

  if (!otherId) {
    return res.status(400).json({ error: 'يجب تحديد المستخدم الآخر' });
  }

  try {
    const result = await getDMHistory({
      userId: req.user.id,
      otherId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (e) {
    console.error('خطأ في جلب سجل الرسائل المباشرة:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسائل' });
  }
}

module.exports = { getMessageHistory, getDMConversation };
