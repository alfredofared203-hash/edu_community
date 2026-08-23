const mongoose = require('mongoose');

<<<<<<< HEAD

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true }, 
=======
// المادة الدراسية (مثلاً: فيزياء — الصف الأول الثانوي)
const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'اسم المادة مطلوب'], trim: true },
    grade: { type: String, required: [true, 'الصف مطلوب'] }, // مثل: sec-1
>>>>>>> backend2
    description: { type: String, default: '' },
    icon: { type: String, default: 'book' },
  },
  { timestamps: true }
);

<<<<<<< HEAD
subjectSchema.set('toJSON', { virtuals: true });
=======
// مايتكررش نفس المادة لنفس الصف
subjectSchema.index({ grade: 1, name: 1 }, { unique: true });

subjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
>>>>>>> backend2

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
