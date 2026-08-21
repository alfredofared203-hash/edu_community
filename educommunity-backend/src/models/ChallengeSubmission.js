const mongoose = require('mongoose');

const challengeSubmissionSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answer: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

challengeSubmissionSchema.index({ challengeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.models.ChallengeSubmission || mongoose.model('ChallengeSubmission', challengeSubmissionSchema);
