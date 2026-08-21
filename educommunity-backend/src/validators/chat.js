


function validateRoomMessage({ grade, content }) {
  if (!grade)          return 'يجب تحديد الصف الدراسي';
  if (!content?.trim()) return 'محتوى الرسالة مطلوب';
  return null;
}


function validateDM({ recipientId, content }) {
  if (!recipientId)    return 'يجب تحديد المستلم';
  if (!content?.trim()) return 'محتوى الرسالة مطلوب';
  return null;
}

module.exports = { validateRoomMessage, validateDM };
