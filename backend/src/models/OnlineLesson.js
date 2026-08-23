const mongoose = require('mongoose');

const onlineLessonSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  grade: { type: String, required: true },
  startsAt: { type: Date, required: true },
  meetingUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.OnlineLesson || mongoose.model('OnlineLesson', onlineLessonSchema);