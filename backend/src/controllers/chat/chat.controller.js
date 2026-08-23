const { getMessages } = require('../../services/chat/chat.service');


async function getMessageHistory(req, res) {
  const { room, page = 1, limit = 20 } = req.query;

  if (!room) {
    return res.status(400).json({ error: 'يجب تحديد الصف الدراسي' });
  }

  try {
    const result = await getMessages({
      grade: room,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result); 
  } catch (e) {
    console.error('خطأ في جلب سجل الرسائل:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسائل' });
  }
}

module.exports = { getMessageHistory };
