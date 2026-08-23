const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
<<<<<<< HEAD
    grade:   { type: String, required: true },   // room id
    content: { type: String, required: true },
    kind: { type: String, enum: ['text', 'audio'], default: 'text' },
=======
    grade:   { type: String, required: true },   // الصف / الغرفة
    content: { type: String, required: true },
>>>>>>> backend2
  },
  { timestamps: true }
);


messageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
