const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    teacher:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject:         { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    grade:           { type: String },
    scheduledAt:     { type: Date, required: true },
    durationMinutes: { type: Number, default: 45 },
    status:          { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    jitsiRoomName:   { type: String, unique: true },
    jitsiRoomUrl:    { type: String },
  },
  { timestamps: true }
);

lessonSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
