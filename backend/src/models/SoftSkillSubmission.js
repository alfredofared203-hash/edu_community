const mongoose = require('mongoose');

const softSkillSubmissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoftSkillTask',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  presentationUrl: {
    type: String,
    required: true  
  },
  grade: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded'],
    default: 'Submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('SoftSkillSubmission', softSkillSubmissionSchema);