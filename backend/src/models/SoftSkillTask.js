const mongoose = require('mongoose');

const softSkillTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SoftSkillTask', softSkillTaskSchema);