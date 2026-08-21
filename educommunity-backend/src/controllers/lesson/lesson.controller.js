const { bookLesson, listLessons } = require('../../services/lesson/lesson.service');
const { validateBookLesson, validateListLessons } = require('../../validators/lesson');

async function bookLessonHandler(req, res) {
  const { teacherId, subjectId, grade, scheduledAt, durationMinutes } = req.body;
  const studentId = req.user.id;

  const err = validateBookLesson({ teacherId, studentId, scheduledAt });
  if (err) return res.status(400).json({ error: err });

  try {
    const lesson = await bookLesson({ teacherId, studentId, subjectId, grade, scheduledAt, durationMinutes });
    res.status(201).json({ lesson });
  } catch (e) {
    if (e.code === 'CONFLICT') return res.status(409).json({ error: e.message });
    if (e.code === 'NOT_TEACHER') return res.status(400).json({ error: e.message });
    console.error('خطأ في حجز الدرس:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء حجز الدرس' });
  }
}

async function getLessons(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const err = validateListLessons({ page, limit });
  if (err) return res.status(400).json({ error: err });

  try {
    const result = await listLessons({
      userId: req.user.id,
      role: req.user.role,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (e) {
    console.error('خطأ في جلب الدروس:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الدروس' });
  }
}

module.exports = { bookLessonHandler, getLessons };
