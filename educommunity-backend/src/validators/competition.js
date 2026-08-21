function validateCreateChallenge({ title, startDate, endDate, correctAnswer }) {
  if (!title?.trim()) return 'عنوان التحدي مطلوب';
  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
  }
  if (startDate && isNaN(new Date(startDate).getTime())) return 'تاريخ البداية غير صالح';
  if (endDate && isNaN(new Date(endDate).getTime())) return 'تاريخ النهاية غير صالح';
  return null;
}

function validateSubmitChallenge({ answer }) {
  if (!answer?.trim()) return 'الإجابة مطلوبة';
  return null;
}

module.exports = { validateCreateChallenge, validateSubmitChallenge };
