const crypto = require('crypto');
const Lesson = require('../../models/Lesson');
const User = require('../../models/User');

function generateJitsiRoom() {
  const roomName = `edu-lesson-${crypto.randomUUID()}`;
  const base = process.env.JITSI_BASE_URL || 'https://meet.jit.si';
  return { jitsiRoomName: roomName, jitsiRoomUrl: `${base}/${roomName}` };
}

async function bookLesson({ teacherId, studentId, subjectId, grade, scheduledAt, durationMinutes = 45 }) {
  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== 'teacher') {
    throw Object.assign(new Error('المعلم غير موجود أو ليس لديه صلاحية التدريس'), { code: 'NOT_TEACHER' });
  }

  const requested = new Date(scheduledAt);
  const buffer = durationMinutes * 60 * 1000;
  const conflict = await Lesson.findOne({
    teacher: teacherId,
    status: { $in: ['pending', 'confirmed'] },
    scheduledAt: {
      $gte: new Date(requested.getTime() - buffer),
      $lte: new Date(requested.getTime() + buffer),
    },
  });
  if (conflict) {
    throw Object.assign(new Error('المعلم لديه درس آخر في هذا الوقت'), { code: 'CONFLICT' });
  }

  const { jitsiRoomName, jitsiRoomUrl } = generateJitsiRoom();

  const lesson = await Lesson.create({
    teacher: teacherId,
    student: studentId,
    subject: subjectId || undefined,
    grade,
    scheduledAt: requested,
    durationMinutes,
    jitsiRoomName,
    jitsiRoomUrl,
  });

  return lesson.populate([
    { path: 'teacher', select: 'name role' },
    { path: 'student', select: 'name role' },
  ]);
}

async function listLessons({ userId, role, page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;
  const filter = role === 'teacher' ? { teacher: userId } : { student: userId };

  const [lessons, total] = await Promise.all([
    Lesson.find(filter)
      .populate('teacher', 'name role')
      .populate('student', 'name role')
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(limit),
    Lesson.countDocuments(filter),
  ]);

  return { lessons, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { bookLesson, listLessons };
