const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    emoji:       { type: String, default: '🏆' },
    cost:        { type: Number, default: 0 },      // XP مطلوب للاستبدال (0 = شارة فقط)
    type:        { type: String, enum: ['badge', 'store'], default: 'badge' },
    requirement: { type: String, default: '' },      // نص شرط الفتح
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

rewardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.Reward || mongoose.model('Reward', rewardSchema);
