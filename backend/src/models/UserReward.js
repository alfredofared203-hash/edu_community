const mongoose = require('mongoose');

const userRewardSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  },
  { timestamps: true }
);

userRewardSchema.index({ user: 1, reward: 1 }, { unique: true });

userRewardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.UserReward || mongoose.model('UserReward', userRewardSchema);
