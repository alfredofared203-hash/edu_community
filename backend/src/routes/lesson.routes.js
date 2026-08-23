const router = require('express').Router();
const OnlineLesson = require('../models/OnlineLesson');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { grade: req.user.grade } : { teacher: req.user.id };
    res.json({ lessons: await OnlineLesson.find(filter).populate('teacher', 'name subject').sort({ startsAt: 1 }) });
  } catch (error) { next(error); }
});

router.post('/', authenticate, authorize('teacher'), async (req, res, next) => {
  try {
    const { title, description, grade, startsAt, meetingUrl } = req.body;
    if (!title || !grade || !startsAt || !meetingUrl) return res.status(400).json({ error: 'العنوان والصف والموعد ورابط الدرس مطلوبة' });
    if (req.user.grade && req.user.grade !== grade) return res.status(403).json({ error: 'يمكنك نشر درس لصفك فقط' });
    const lesson = await OnlineLesson.create({ teacher: req.user.id, title, description, grade, startsAt, meetingUrl });
    const students = await User.find({ role: 'student', grade }).select('_id');
    if (students.length) await Notification.insertMany(students.map((student) => ({ user: student._id, type: 'lesson', title: 'درس مباشر جديد', body: `${title} متاح لصفك`, link: '/lessons' })));
    res.status(201).json({ lesson });
  } catch (error) { next(error); }
});

module.exports = router;