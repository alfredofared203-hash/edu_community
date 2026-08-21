const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: String,
  },
  grade: {
    type: String,
  },
  points: {
    type: Number,
    default: 100,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  durationMinutes: {
    type: Number,
    default: 30,
  },
  correctAnswer: {
    type: String,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
});

challengeSchema.methods.isOpen = function () {
  if (!this.active) return false;
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
};

module.exports = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
