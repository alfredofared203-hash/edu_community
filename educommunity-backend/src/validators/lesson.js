function validateBookLesson({ teacherId, studentId, scheduledAt }) {
  if (!teacherId) return 'يجب تحديد المعلم';
  if (!scheduledAt) return 'يجب تحديد موعد الدرس';
  const date = new Date(scheduledAt);
  if (isNaN(date.getTime())) return 'موعد الدرس غير صالح';
  if (date <= new Date()) return 'يجب أن يكون موعد الدرس في المستقبل';
  return null;
}

function validateListLessons({ page, limit }) {
  if (page !== undefined && (isNaN(page) || Number(page) < 1)) return 'رقم الصفحة غير صالح';
  if (limit !== undefined && (isNaN(limit) || Number(limit) < 1)) return 'حجم الصفحة غير صالح';
  return null;
}

module.exports = { validateBookLesson, validateListLessons };
